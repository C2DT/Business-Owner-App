<script id="ibo-supabase-sync">
(function(){
  // Publishable key is intended for browser use; database access is restricted by RLS.
  const SUPABASE_URL='https://gbbkqqfqavlvcishpymk.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_CGr7P_62_HBtXG4aTijB-w_Mu8c6Hnm';
  const SESSION_KEY='iboSupabaseSession_v1';
  let session=null, syncing=false;
  const PENDING_INVITE_KEY='iboPendingSponsorInvite_v1';
  const PENDING_PARTNERSHIP_INVITE_KEY='iboPendingPartnershipInvite_v1';
  const el=id=>document.getElementById(id);
  function status(msg){const n=el('ibo-cloud-status');if(n)n.textContent=msg}
  function sponsorStatus(msg){const n=el('ibo-sponsor-status');if(n)n.textContent=msg}
  function getPendingInvite(){try{return localStorage.getItem(PENDING_INVITE_KEY)||''}catch(e){return ''}}
  function setPendingInvite(token){try{if(token)localStorage.setItem(PENDING_INVITE_KEY,token);else localStorage.removeItem(PENDING_INVITE_KEY)}catch(e){}}
  function captureInviteFromUrl(){
    try{
      const u=new URL(window.location.href);
      const sponsorToken=u.searchParams.get('sponsor_invite');
      const partnershipToken=u.searchParams.get('partnership_invite');
      if(sponsorToken){setPendingInvite(sponsorToken);status('Sponsor invitation detected. Sign in or create an account below to accept it.');u.searchParams.delete('sponsor_invite');}
      if(partnershipToken){try{localStorage.setItem(PENDING_PARTNERSHIP_INVITE_KEY,partnershipToken)}catch(e){}status('Spouse invitation detected. Sign in with the account you want to link.');u.searchParams.delete('partnership_invite');}
      if(sponsorToken||partnershipToken)window.history.replaceState({},document.title,u.pathname+(u.search?u.search:'')+u.hash);
    }catch(e){}
  }
  captureInviteFromUrl();
  function getSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch(e){return null}}
  function setSession(s){session=s;try{if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY)}catch(e){}}
  async function refreshHomeTeamName(){
    const title=el('app-home-title'),sub=el('app-home-subtitle');
    if(!session||!session.access_token){if(title)title.textContent='Business Owner App';if(sub)sub.textContent='v5.3.78';return}
    if(title)title.textContent='Business Owner App';
    if(sub)sub.textContent='v5.3.78 · Loading team…';
    try{
      const uplines=await window.iboGetMyUplines();
      const direct=(Array.isArray(uplines)?uplines:[]).slice().sort((a,b)=>(a.depth||999)-(b.depth||999))[0];
      let last=(direct&&(direct.last_name||'').trim())||'';
      if(!last&&direct&&direct.full_name){const parts=String(direct.full_name).trim().split(/\s+/);last=parts.length?parts[parts.length-1]:''}
      if(sub)sub.textContent='v5.3.78'+(last?' · '+last+' Team':' · Team name unavailable');
    }catch(e){if(sub)sub.textContent='v5.3.78 · Team name unavailable'}
  }
  window.refreshHomeTeamName=refreshHomeTeamName;
  function renderAuth(){const signed=!!(session&&session.access_token&&session.user);el('ibo-cloud-signed-out').style.display=signed?'none':'block';el('ibo-cloud-signed-in').style.display=signed?'block':'none';if(signed)el('ibo-cloud-user').textContent='Signed in as '+(session.user.email||'your account')+'. Audio + Reading history sync is enabled.';refreshHomeTeamName()}
  async function request(path,options={}){
    const headers=Object.assign({'apikey':SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},options.headers||{});
    if(session&&session.access_token)headers.Authorization='Bearer '+session.access_token;
    const res=await fetch(SUPABASE_URL+path,Object.assign({},options,{headers}));
    const text=await res.text();let data=null;try{data=text?JSON.parse(text):null}catch(e){data=text}
    if(!res.ok){let message=(data&&(data.msg||data.message||data.error_description||data.error))||('Request failed ('+res.status+')');throw new Error(message)}return data;
  }
  function buildInviteUrl(token){
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
  }
  window.iboGetMyUplines=async function(){
    if(!session||!session.access_token)throw new Error('Sign in to load names from your sponsor hierarchy.');
    return await request('/rest/v1/rpc/get_my_uplines',{method:'POST',body:JSON.stringify({})});
  };
  window.iboCreateSponsorInvite=async function(){
    if(!session||!session.access_token){sponsorStatus('Sign in first to generate an invitation link.');return}
    const btns=document.querySelectorAll('button[onclick="iboCreateSponsorInvite()"]');btns.forEach(b=>b.disabled=true);
    sponsorStatus('Generating a unique 48-hour invitation link…');
    try{
      const data=await request('/rest/v1/rpc/create_sponsor_invite',{method:'POST',body:JSON.stringify({})});
      const token=typeof data==='string'?data:(Array.isArray(data)?data[0]:data&&data.create_sponsor_invite);
      if(typeof token!=='string'||token.length<32)throw new Error('The database did not return a valid invitation token.');
      const link=buildInviteUrl(token);
      const field=el('ibo-sponsor-invite-link');if(field)field.value=link;
      sponsorStatus('Link created. It expires 48 hours after generation. Send it privately to one person you want to sponsor.');
    }catch(e){sponsorStatus('Could not create invitation: '+e.message)}
    finally{btns.forEach(b=>b.disabled=false)}
  };
  window.iboCopySponsorInvite=async function(){
    const field=el('ibo-sponsor-invite-link');
    if(!field||!field.value){sponsorStatus('Generate an invitation link first.');return}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(field.value);}
      else{field.focus();field.select();const ok=document.execCommand('copy');if(!ok)throw new Error('Copy is not available in this browser.');}
      sponsorStatus('Invitation link copied. Send it privately; anyone with the link can attempt to join through you until it expires.');
    }catch(e){field.focus();field.select();sponsorStatus('Select and copy the link above. '+e.message)}
  };
  function partnershipStatus(msg){const n=el('ibo-partnership-status');if(n)n.textContent=msg}
  function getPendingPartnershipInvite(){try{return localStorage.getItem(PENDING_PARTNERSHIP_INVITE_KEY)||''}catch(e){return ''}}
  function setPendingPartnershipInvite(token){try{if(token)localStorage.setItem(PENDING_PARTNERSHIP_INVITE_KEY,token);else localStorage.removeItem(PENDING_PARTNERSHIP_INVITE_KEY)}catch(e){}}
  function buildPartnershipInviteUrl(token){
    const publishedAppUrl='https://c2dt.github.io/Business-Owner-App/';
    const base=(window.location.protocol==='file:'||window.location.origin==='null')?publishedAppUrl:window.location.href;
    const u=new URL(base);u.searchParams.delete('sponsor_invite');u.searchParams.set('partnership_invite',token);u.hash='';return u.toString();
  }
  window.iboRefreshPartnershipStatus=async function(){
    const createArea=el('ibo-partnership-create-area'),acceptArea=el('ibo-partnership-accept-area');
    if(!session||!session.access_token){partnershipStatus('Sign in to link or view a spouse partnership.');if(createArea)createArea.style.display='none';if(acceptArea)acceptArea.style.display=getPendingPartnershipInvite()?'block':'none';return}
    if(createArea)createArea.style.display='block';
    if(acceptArea)acceptArea.style.display=getPendingPartnershipInvite()?'block':'none';
    partnershipStatus('Checking partnership status…');
    try{
      const rows=await request('/rest/v1/business_partnership_members?select=partnership_id,member_role,membership_status&user_id=eq.'+encodeURIComponent(session.user.id)+'&membership_status=eq.active');
      if(rows&&rows.length){
        const p=await request('/rest/v1/business_partnerships?select=id,status&id=eq.'+encodeURIComponent(rows[0].partnership_id));
        const state=p&&p[0]?p[0].status:'active';
        partnershipStatus(state==='active'?'Your spouse partnership is active. Shared business features will be available as they are connected.':'Your spouse partnership invitation is waiting for the other person to accept.');
        if(createArea)createArea.style.display=state==='active'?'none':'block';
      }else{
        partnershipStatus(getPendingPartnershipInvite()?'Spouse invitation detected. Accept it to link this account.':'No spouse partnership is linked to this account yet.');
      }
    }catch(e){partnershipStatus('Could not check partnership status: '+e.message)}
  };
  window.iboCreatePartnershipInvite=async function(){
    if(!session||!session.access_token){partnershipStatus('Sign in first to create a spouse invitation.');return}
    const btn=document.querySelector('#settings-partnership button[onclick="iboCreatePartnershipInvite()"]');if(btn)btn.disabled=true;
    partnershipStatus('Creating a secure spouse invitation…');
    try{
      const data=await request('/rest/v1/rpc/create_business_partnership_invite',{method:'POST',body:JSON.stringify({})});
      const token=typeof data==='string'?data:(Array.isArray(data)?data[0]:data&&data.create_business_partnership_invite);
      if(typeof token!=='string'||token.length<32)throw new Error('The database did not return a valid invitation code.');
      const link=buildPartnershipInviteUrl(token),field=el('ibo-partnership-invite-link');if(field)field.value=link;
      partnershipStatus('Invitation created. Send this link privately to your spouse. It expires in 7 days.');
      await window.iboRefreshPartnershipStatus();
    }catch(e){partnershipStatus('Could not create spouse invitation: '+e.message)}
    finally{if(btn)btn.disabled=false}
  };
  window.iboCopyPartnershipInvite=async function(){
    const field=el('ibo-partnership-invite-link');if(!field||!field.value){partnershipStatus('Create a spouse invitation first.');return}
    try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(field.value);else{field.focus();field.select();if(!document.execCommand('copy'))throw new Error('Copy is not available in this browser.')}partnershipStatus('Spouse invitation link copied. Send it privately to your spouse.')}
    catch(e){field.focus();field.select();partnershipStatus('Select and copy the invitation link. '+e.message)}
  };
  window.iboAcceptPartnershipInvite=async function(){
    const code=getPendingPartnershipInvite();
    if(!code){partnershipStatus('No spouse invitation was found. Open the invitation link again.');return}
    if(!session||!session.access_token){partnershipStatus('Sign in with the account you want to link before accepting.');return}
    const btn=document.querySelector('#settings-partnership button[onclick="iboAcceptPartnershipInvite()"]');if(btn)btn.disabled=true;
    partnershipStatus('Accepting spouse invitation…');
    try{
      await request('/rest/v1/rpc/accept_business_partnership_invite',{method:'POST',body:JSON.stringify({p_invite_code:code})});
      setPendingPartnershipInvite('');
      const field=el('ibo-partnership-invite-link');if(field)field.value='';
      partnershipStatus('Spouse accounts successfully linked. Your individual logins remain separate.');
      await window.iboRefreshPartnershipStatus();
    }catch(e){partnershipStatus('Could not accept spouse invitation: '+e.message)}
    finally{if(btn)btn.disabled=false}
  };
  async function acceptPendingPartnershipInvite(){
    if(!getPendingPartnershipInvite()||!session||!session.access_token)return;
    await window.iboAcceptPartnershipInvite();
  }

  async function acceptPendingSponsorInvite(){
    const token=getPendingInvite();
    if(!token)return;
    if(!session||!session.access_token){sponsorStatus('Invitation found. Sign in or create an account here to accept it.');return}
    sponsorStatus('Accepting sponsor invitation…');
    try{
      await request('/rest/v1/rpc/accept_sponsor_invite',{method:'POST',body:JSON.stringify({invite_token:token})});
      setPendingInvite('');
      const field=el('ibo-sponsor-invite-link');if(field)field.value='';
      sponsorStatus('Invitation accepted. Your sponsor relationship is saved. You are now part of your sponsor’s downline.');
      status('Sponsor invitation accepted. Your organization relationship is connected.');
    }catch(e){
      sponsorStatus('Could not accept invitation: '+e.message+' If the link expired, ask the inviter to generate a new one.');
    }
  }
  function mergeRows(rows){
    const remoteKeys=new Set();
    (rows||[]).forEach(row=>{const k=row.activity_date;if(!k)return;remoteKeys.add(k);const local=S.days[k]||{};S.days[k]={...local,audio:!!local.audio||!!row.audio_completed,reading:!!local.reading||!!row.reading_completed}});
    // Preserve local-only days and merge local checkmarks into the cloud on first sync.
    const payload=[];
    Object.keys(S.days||{}).forEach(k=>{const d=S.days[k]||{};if(typeof d.audio==='boolean'||typeof d.reading==='boolean')payload.push({user_id:session.user.id,activity_date:k,audio_completed:!!d.audio,reading_completed:!!d.reading})});
    save();return payload;
  }
  async function pushRows(rows){
    if(!rows.length)return;
    // Small batches keep requests manageable for longer histories.
    for(let i=0;i<rows.length;i+=100){await request('/rest/v1/daily_activity?on_conflict=user_id%2Cactivity_date',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows.slice(i,i+100))})}
  }
  function readingSnapshotToCloud(){
    if(!window.iboGetReadingLibrarySnapshot)return {customBooks:[],stateByTitle:{}};
    const snap=window.iboGetReadingLibrarySnapshot(),stateByTitle={};
    Object.keys(snap.state||{}).forEach(k=>{const title=snap.books[Number(k)-1],v=snap.state[k];if(title&&v&&['blank','current','finished','previously-completed'].includes(v.status))stateByTitle[title]=v});
    return {customBooks:snap.customBooks||[],stateByTitle};
  }
  async function syncReadingLibrary(){
    if(!session||!session.access_token||!window.iboGetReadingLibrarySnapshot)return;
    const local=readingSnapshotToCloud();
    const rows=await request('/rest/v1/reading_library?select=custom_books,state_by_title&user_id=eq.'+encodeURIComponent(session.user.id));
    const remote=rows&&rows[0]?rows[0]:{custom_books:[],state_by_title:{}};
    const customBooks=[...new Map([...(remote.custom_books||[]),...(local.customBooks||[])].filter(x=>typeof x==='string'&&x.trim()).map(x=>[x.toLowerCase(),x])).values()];
    const stateByTitle={...(remote.state_by_title||{}),...(local.stateByTitle||{})};
    // Keep only one active "currently reading" book in the merged library.
    const current=Object.keys(stateByTitle).filter(t=>stateByTitle[t]&&stateByTitle[t].status==='current');
    if(current.length>1){const keep=current[current.length-1];current.filter(t=>t!==keep).forEach(t=>{delete stateByTitle[t]})}
    const payload={user_id:session.user.id,custom_books:customBooks,state_by_title:stateByTitle,updated_at:new Date().toISOString()};
    await request('/rest/v1/reading_library?on_conflict=user_id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(payload)});
    window.iboApplyReadingLibrarySnapshot({customBooks,stateByTitle});
  }
  window.iboCloudSyncReadingLibrary=async function(){
    if(!session||!session.access_token)return;
    try{await syncReadingLibrary();status('Reading books and history saved to your account.')}
    catch(e){status('Reading data is saved on this device, but cloud backup failed: '+e.message+'. Run Sync Now again.')}
  };
  async function syncAll(){
    if(!session||syncing)return;syncing=true;status('Syncing Audio, Reading history, and book library…');
    try{
      const rows=await request('/rest/v1/daily_activity?select=activity_date,audio_completed,reading_completed&order=activity_date.asc');
      const payload=mergeRows(rows||[]);await pushRows(payload);
      await syncReadingLibrary();
      render();status('Synced successfully. Audio, Reading checkmarks, custom books, and book history are backed up to your account.');
    }catch(e){status('Sync failed: '+e.message+'. Your local app data is still saved on this device.');}
    finally{syncing=false}
  }
  window.iboCloudSyncDay=async function(k){if(!session||syncing)return;const d=(S.days||{})[k]||{};try{await pushRows([{user_id:session.user.id,activity_date:k,audio_completed:!!d.audio,reading_completed:!!d.reading}]);status('Saved locally and synced to your account.')}catch(e){status('Saved locally, but cloud sync failed: '+e.message+'. Tap Sync Now to retry.')}};
  window.iboCloudSyncNow=syncAll;
  async function ensureOwnProfile(reg){
    if(!session||!session.access_token||!session.user)return;
    const first=(reg&&reg.first_name)||session.user.user_metadata?.first_name||'';
    const last=(reg&&reg.last_name)||session.user.user_metadata?.last_name||'';
    const display=(reg&&reg.display_name)||session.user.user_metadata?.display_name||[first,last].filter(Boolean).join(' ');
    if(!first||!last)throw new Error('Your profile is missing a first or last name. Sign out and use Create Account with both names, or contact support to repair this profile.');
    await request('/rest/v1/profiles?on_conflict=user_id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:session.user.id,first_name:first,last_name:last,display_name:display})});
  }
  window.iboCloudSignUp=async function(){
    const email=el('ibo-cloud-email').value.trim(),password=el('ibo-cloud-password').value;
    if(!email||!password){status('Enter your email address and password first.');return}if(password.length<6){status('Choose a password with at least 6 characters.');return}
    status('Creating your account…');
    try{const reg=window.iboRegistrationName||{};if(!reg.first_name||!reg.last_name){status('Enter your first and last name in the Create Account form.');return}const data=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password,data:{first_name:reg.first_name,last_name:reg.last_name,display_name:reg.display_name}})});if(data&&data.access_token&&data.user){setSession(data);renderAuth();await ensureOwnProfile(reg);await syncAll();await acceptPendingSponsorInvite();await acceptPendingPartnershipInvite();await window.iboRefreshPartnershipStatus();window.iboRegistrationName=null}else{status('Account created. Check your email for a confirmation link. Your profile will be created automatically; return here and sign in to accept the invitation.');if(getPendingInvite())sponsorStatus('Invitation saved on this device. Confirm your email, then return and sign in to accept it.')} }catch(e){status('Could not create account: '+e.message)}
  };
  window.iboCloudSignIn=async function(){
    const email=el('ibo-cloud-email').value.trim(),password=el('ibo-cloud-password').value;
    if(!email||!password){status('Enter your email address and password first.');return}
    status('Signing in…');
    try{const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});setSession(data);renderAuth();const meta=data.user&&data.user.user_metadata||{};if(meta.first_name&&meta.last_name){try{await ensureOwnProfile({first_name:meta.first_name,last_name:meta.last_name,display_name:meta.display_name||meta.first_name+' '+meta.last_name})}catch(profileError){status('Signed in, but profile setup needs attention: '+profileError.message)}}await syncAll();await acceptPendingSponsorInvite();await acceptPendingPartnershipInvite();await window.iboRefreshPartnershipStatus()}catch(e){status('Could not sign in: '+e.message+'. If you just created the account, confirm your email first.')}
  };
  window.iboCloudSignOut=function(){setSession(null);renderAuth();status('Signed out. This device continues to save activity locally.')};
  async function init(){
    session=getSession();
    if(session&&session.refresh_token){try{const data=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});if(data.ok)setSession(await data.json());else{setSession(null)}}catch(e){/* Keep the current local app usable when offline. */}}
    renderAuth();if(session&&session.access_token){syncAll();acceptPendingSponsorInvite();acceptPendingPartnershipInvite();window.iboRefreshPartnershipStatus()}else if(getPendingInvite()||getPendingPartnershipInvite()){sponsorStatus('Invitation found. Sign in or create an account to accept it.')} 
  }
  init();
})();
</script>