/* BrainSAIT Telemedicine — RealtimeKit / Realtime DO inside BDD
   Uses healthcare-services Realtime Durable Object + WebRTC placeholder
   Rows: [patient] [doctor] [time] [type]
*/
export default function decorate(block){
  const rooms = [...block.children].map(r=>{
    const c=[...r.children].map(x=>x.textContent.trim());
    return {patient:c[0], doctor:c[1]||"Dr. El Fadil", time:c[2]||"Now", type:c[3]||"Video"};
  });
  const HEALTH="https://healthcare-services.brainsait-fadil.workers.dev";
  const wrap=document.createElement('div'); wrap.className='tele-wrap';
  wrap.innerHTML=`<div class="tele-head"><h3>Tele-Medicine — Realtime Rooms</h3><p>Powered by Realtime DO (WebSocket-ready) · Basma voice inside</p></div>
    <div class="tele-grid"></div>
    <div class="tele-stage" style="display:none"><iframe class="tele-frame" allow="camera; microphone; display-capture" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
    <div class="tele-chat"><div class="tele-log"></div><div style="display:flex;gap:6px"><input class="tele-input" placeholder="Chat in room"><button class="tele-send">Send</button></div></div></div>`;
  const grid=wrap.querySelector('.tele-grid');
  const stage=wrap.querySelector('.tele-stage');
  const frame=wrap.querySelector('.tele-frame');
  const log=wrap.querySelector('.tele-log');
  const input=wrap.querySelector('.tele-input');
  rooms.forEach((r,i)=>{
    const card=document.createElement('button'); card.className='tele-card';
    card.innerHTML=`<span class="tele-time">${r.time}</span><strong>${r.patient}</strong> — ${r.doctor}<br><small>${r.type}</small>`;
    card.addEventListener('click', async ()=>{
      const room=`room-${r.patient.replace(/\s+/g,'-')}-${Date.now()}`;
      stage.style.display='flex';
      frame.src=`${HEALTH}/api/room/${room}/view`;
      log.innerHTML=`<div>🟢 Joined ${room}</div>`;
      // poll view
      setInterval(async()=>{
        try{ const v=await fetch(`${HEALTH}/api/room/${room}/view`).then(v=>v.json()); log.innerHTML=Object.entries(v).map(([k,m])=>`<div><b>${k}:</b> ${m}</div>`).join('') }catch{}
      }, 2500);
    });
    grid.append(card);
  });
  wrap.querySelector('.tele-send').addEventListener('click', async()=>{
    const msg=input.value.trim(); if(!msg) return;
    const url=frame.src.split('/view')[0]+'/push';
    await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({from:'doctor',msg})});
    input.value='';
  });
  block.replaceChildren(wrap);
}
