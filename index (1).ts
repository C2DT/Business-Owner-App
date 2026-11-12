import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, 'Content-Type': 'application/json' },
});
const hex = (bytes: Uint8Array) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
async function sha256(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))));
}
function randomToken(bytes = 32) {
  return hex(crypto.getRandomValues(new Uint8Array(bytes)));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST required' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return json({ error: 'Server configuration is incomplete.' }, 500);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  async function importOne(tokenHash: string, contact: Record<string, unknown>, listType: string) {
    const { data, error } = await admin.rpc('apply_contact_shortcut_import', {
      p_token_hash: tokenHash,
      p_name: String(contact.name || '').trim(),
      p_phone: String(contact.phone || '').trim(),
      p_list_type: listType,
      p_duplicate_action: contact.duplicateAction == null ? null : String(contact.duplicateAction),
    });
    if (error) return { status: 'error', name: String(contact.name || ''), error: error.message };
    return data;
  }

  try {
    const body = await req.json();
    const action = String(body.action || '');

    if (action === 'pair') {
      const code = String(body.code || '').trim().toUpperCase();
      if (!/^[A-F0-9]{32}$/.test(code)) return json({ error: 'Enter the 32-character pairing code shown in IBO App.' }, 400);
      const token = randomToken(32);
      const { data, error } = await admin.rpc('exchange_contact_shortcut_pairing', {
        p_code_hash: await sha256(code), p_token_hash: await sha256(token),
      });
      if (error) return json({ error: 'Pairing code is invalid, expired, or already used.' }, 401);
      return json({ status: 'paired', token, user_id: data, message: 'Connected. Keep this credential private.' });
    }

    if (action === 'import' || action === 'import_batch') {
      const token = String(body.token || '').trim();
      if (!/^[a-f0-9]{64}$/i.test(token)) return json({ error: 'Shortcut is not paired. Connect it in IBO App.' }, 401);
      const listType = String(body.listType || '');
      if (listType !== 'customer' && listType !== 'prospect') return json({ error: 'Choose Customer or Prospect for this import.' }, 400);
      const tokenHash = await sha256(token);

      if (action === 'import') {
        const result = await importOne(tokenHash, body, listType);
        return json(result, result?.status === 'error' ? 400 : 200);
      }

      if (!Array.isArray(body.contacts) || body.contacts.length < 1 || body.contacts.length > 100) {
        return json({ error: 'A batch must contain between 1 and 100 contacts.' }, 400);
      }
      // Each contact is processed independently so duplicates and invalid records
      // are reported without hiding successful imports elsewhere in the batch.
      const results = [];
      for (const raw of body.contacts) {
        const contact = raw && typeof raw === 'object' && !Array.isArray(raw)
          ? raw as Record<string, unknown> : {};
        results.push(await importOne(tokenHash, contact, listType));
      }
      const counts = results.reduce((out: Record<string, number>, item: any) => {
        const key = String(item?.status || 'error');
        out[key] = (out[key] || 0) + 1;
        return out;
      }, {});
      return json({ status: 'batch_complete', listType, total: results.length, counts, results });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
