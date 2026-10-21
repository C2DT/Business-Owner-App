from pathlib import Path
p=Path('/mnt/data/ibo_work/index.html')
s=p.read_text()
s=s.replace('<body data-version="v5.2.60"><div class="wrap">\n<header><div><h1>Business Owner App</h1><div class="sub">v5.2.60</div></div><button class="top" onclick="show(\'home\')">Home</button></header>\n<div class="streak-badge-setup">\n  <button type="button" class="top streak-badge-button" onclick="enableStreakBadge()">Enable Streak Badge</button>\n  <div id="streak-badge-status" class="sub" role="status" aria-live="polite">Optional: allow notifications to show your current Audio + Reading streak on the Home Screen app icon.</div>\n</div>\n\n<section id="ibo-cloud-panel" class="section" aria-labelledby="ibo-cloud-title" style="margin-top:8px">', '''<body data-version="v5.2.61"><div class="wrap">
<header><div><h1>Business Owner App</h1><div class="sub">v5.2.61</div></div><button class="top settings-gear" type="button" onclick="show('settings')" aria-label="Open Settings" title="Settings">⚙</button></header>

<section id="settings" class="screen" aria-labelledby="settings-title">
  <button class="top" type="button" onclick="show('home')">← Home</button>
  <div class="section" style="margin-top:9px">
    <h2 id="settings-title">Settings</h2>
    <p class="note">Manage streak features, account access, sponsor invitations, and data stored on this device.</p>
    <div class="streak-badge-setup" style="margin-top:10px">
      <button type="button" class="top streak-badge-button" onclick="enableStreakBadge()">Enable Streak Badge</button>
      <div id="streak-badge-status" class="sub" role="status" aria-live="polite">Optional: allow notifications to show your current Audio + Reading streak on the Home Screen app icon.</div>
    </div>
  </div>

<section id="ibo-cloud-panel" class="section" aria-labelledby="ibo-cloud-title" style="margin-top:8px">''')
# Close settings wrapper after cloud panel
s=s.replace('''  <div id="ibo-cloud-status" class="note" role="status" aria-live="polite" style="margin-top:8px">Not connected. Your app continues to save locally until you sign in.</div>
</section>

<section id="home"''', '''  <div id="ibo-cloud-status" class="note" role="status" aria-live="polite" style="margin-top:8px">Not connected. Your app continues to save locally until you sign in.</div>
</section>

  <section class="section" aria-labelledby="data-settings-title">
    <h2 id="data-settings-title">Local App Data</h2>
    <p class="note">Clear data saved in this browser on this device, including local streak history and app preferences. This signs you out on this device. It does not delete data already stored in your Supabase account.</p>
    <button type="button" class="top" style="border-color:#a44;color:#ffb4b4" onclick="clearLocalAppData()">Clear Data on This Device</button>
    <div id="clear-local-data-status" class="note" role="status" aria-live="polite" style="margin-top:8px"></div>
  </section>
</section>

<section id="home"''')
# Add gear styling
s=s.replace('.top{background:var(--panel2);color:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px}', '.top{background:var(--panel2);color:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 10px}.settings-gear{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;font-size:25px;line-height:1;padding:0;border-radius:12px}')
# Version update in title or elsewhere
s=s.replace('v5.2.60','v5.2.61')
# Make invitation links valid when app is opened from a local file preview
old='''  function buildInviteUrl(token){
    const u=new URL(window.location.href);
    u.searchParams.delete('sponsor_invite');
    u.searchParams.set('sponsor_invite',token);
    u.hash='';
    return u.toString();
  }'''
new='''  function buildInviteUrl(token){
    // Invitation links must be web URLs, never local file:/// paths.
    const publishedAppUrl='https://c2dt.github.io/Business-Owner-App/';
    const base=(window.location.protocol==='file:'||window.location.origin==='null')
      ? publishedAppUrl
      : window.location.href;
    const u=new URL(base);
    u.searchParams.delete('sponsor_invite');
    u.searchParams.set('sponsor_invite',token);
    u.hash='';
    return u.toString();
  }'''
if old not in s:
    raise SystemExit('Could not find buildInviteUrl function')
s=s.replace(old,new)
# Add clear data function near show function
needle="function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='pv')render()}"
replacement=needle+'''\nfunction clearLocalAppData(){\n  const confirmed=window.confirm('Clear all IBO App data stored on this device? This will erase local streak history and preferences and sign you out here. Data already stored in your Supabase account will NOT be deleted. This cannot be undone.');\n  if(!confirmed)return;\n  try{localStorage.clear();sessionStorage.clear();}catch(e){alert('Could not clear all local data in this browser. Please check browser storage settings and try again.');return}\n  window.location.reload();\n}'''
if needle not in s:
    raise SystemExit('Could not find show function')
s=s.replace(needle,replacement)
p.write_text(s)

# Update README version and mention settings changes
readme=Path('/mnt/data/ibo_work/README.md')
if readme.exists():
    r=readme.read_text()
    r=r.replace('v5.2.60','v5.2.61')
    r += '\n\n## v5.2.61 Settings\n- Moved Streak Badge, Shared Streak Sync, sign-in/sign-out, and Sponsor Invitations into the Settings screen opened by the gear icon in the top-right corner.\n- Added a Clear Data on This Device action with a confirmation prompt. It clears browser-local data and signs out locally; it does not delete Supabase cloud data.\n- Sponsor invite links generated from a local file preview now use the published GitHub Pages URL rather than a non-shareable file:/// URL.\n'
    readme.write_text(r)
