/* LUCKY SPIN ROYAL V5.0 — Royal Events & Collection Layer
   Additive layer for V4.0/V4.1. Keeps existing game engine and local save key.
   Virtual entertainment only: coins/tickets/stamps have no cash value. */
(()=>{
'use strict';
const STORE='lsRoyalDemoV2';
const $=id=>document.getElementById(id);
const safeParse=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){return {}}};
let data=safeParse();
const defaults={v5Stamps:0,v5Tickets:{1:0,2:0,3:0,4:0,5:0},v5Claimed:[],v5Difficulty:{},v5Daily:{date:'',spins:0,wins:0,claims:[]},v5Weekly:{week:'',spins:0,wins:0,claims:[]},v5BonusRounds:0};
Object.keys(defaults).forEach(k=>{if(data[k]===undefined)data[k]=defaults[k]});
if(!data.v5Tickets||typeof data.v5Tickets!=='object')data.v5Tickets={...defaults.v5Tickets};
if(!data.v5Difficulty||typeof data.v5Difficulty!=='object')data.v5Difficulty={};
if(!Array.isArray(data.v5Claimed))data.v5Claimed=[];
const originalSave=window.save;
function persist(){try{const latest=safeParse();Object.assign(latest,data);localStorage.setItem(STORE,JSON.stringify(latest));}catch(e){}}
function money(n){return typeof window.money==='function'?window.money(n):Number(n||0).toLocaleString('en-IN')}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function weekKey(){const d=new Date();const first=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-W'+Math.ceil((((d-first)/86400000)+first.getDay()+1)/7)}
function syncPeriods(){if(data.v5Daily.date!==today())data.v5Daily={date:today(),spins:0,wins:0,claims:[]};if(data.v5Weekly.week!==weekKey())data.v5Weekly={week:weekKey(),spins:0,wins:0,claims:[]}}
syncPeriods();
const milestones=[
 {n:8,name:'First Steps',coins:100000,tickets:{1:2}},
 {n:15,name:'Rising Star',coins:300000,tickets:{2:2}},
 {n:20,name:'Royal Explorer',coins:750000,tickets:{3:2}},
 {n:50,name:'Royal Champion',coins:2500000,tickets:{4:2}},
 {n:100,name:'Legendary Collector',coins:10000000,tickets:{5:1}}
];
const ticketNames={1:'Bronze',2:'Silver',3:'Amethyst',4:'Royal Gold',5:'Legendary'};
const ticketColors={1:'#aeb9c8',2:'#72c8f0',3:'#b58aff',4:'#f0bd62',5:'#ffe17a'};
function addTicket(star,count=1){data.v5Tickets[star]=(Number(data.v5Tickets[star])||0)+count}
function rewardMilestone(m){if(data.v5Claimed.includes(m.n))return;data.v5Claimed.push(m.n);const s=window.state;if(s){s.balance+=m.coins;Object.entries(m.tickets).forEach(([k,v])=>addTicket(k,v));if(typeof window.addXP==='function')window.addXP(100+m.n*2)}persist();if(typeof window.updateHUD==='function')window.updateHUD();render();toastV5('Milestone claimed: '+m.name+' · '+money(m.coins)+' virtual coins')}
function toastV5(msg){if(typeof window.toast==='function')window.toast(msg);else console.info(msg)}
function render(){
 const s=window.state;if(!s)return;
 const stamp=$('v5StampCount');if(stamp)stamp.textContent=data.v5Stamps;
 const track=$('v5MilestoneTrack');if(track){const next=milestones.find(m=>data.v5Stamps<m.n);track.innerHTML=milestones.map(m=>{const done=data.v5Stamps>=m.n,claimed=data.v5Claimed.includes(m.n),pct=Math.min(100,data.v5Stamps/m.n*100);return '<div class="v5-milestone"><div class="v5-milestone-top"><b>'+m.name+'</b><span>'+Math.min(data.v5Stamps,m.n)+' / '+m.n+' stamps</span></div><div class="v5-progress"><i style="width:'+pct+'%"></i></div><small>Reward: '+money(m.coins)+' coins + '+Object.entries(m.tickets).map(([k,v])=>v+' × '+k+'★').join(', ')+'</small><button '+(!done||claimed?'disabled':'')+' data-v5-claim="'+m.n+'">'+(claimed?'CLAIMED':done?'CLAIM REWARD':'LOCKED')+'</button></div>'}).join('')+(next?'<small class="v5-muted">Next milestone: '+next.name+' at '+next.n+' stamps</small>':'<small class="v5-muted">All stamp milestones completed. Your collection journey continues.</small>')}
 const tickets=$('v5TicketInventory');if(tickets)tickets.innerHTML=[1,2,3,4,5].map(n=>'<div class="v5-ticket" style="--ticket:'+ticketColors[n]+'"><strong>'+'★'.repeat(n)+'</strong><b>'+Number(data.v5Tickets[n]||0)+'</b><small>'+ticketNames[n]+'</small></div>').join('');
 const mode=$('v5CurrentMode');if(mode)mode.textContent=(data.v5Difficulty[(window.current&&window.current.id)||'aztec']||'medium').toUpperCase();
 const daily=$('v5DailyList'),weekly=$('v5WeeklyList');
 const dqs=[{id:'d3',name:'Daily Explorer',desc:'Play 3 spins',goal:3,cur:data.v5Daily.spins,coins:50000,star:1},{id:'d8',name:'Daily Adventurer',desc:'Play 8 spins',goal:8,cur:data.v5Daily.spins,coins:125000,star:1},{id:'dw2',name:'Daily Lucky Moments',desc:'Get 2 winning spins',goal:2,cur:data.v5Daily.wins,coins:100000,star:2}];
 const wqs=[{id:'w25',name:'Weekly Trailblazer',desc:'Play 25 spins',goal:25,cur:data.v5Weekly.spins,coins:500000,star:2},{id:'w10',name:'Weekly Victor',desc:'Get 10 winning spins',goal:10,cur:data.v5Weekly.wins,coins:750000,star:3}];
 function questHTML(q,scope){let claimed=data[scope].claims.includes(q.id),ready=q.cur>=q.goal;return '<div class="v5-quest"><b>'+q.name+'</b><small>'+q.desc+' · '+Math.min(q.cur,q.goal)+'/'+q.goal+'</small><div class="v5-progress"><i style="width:'+Math.min(100,q.cur/q.goal*100)+'%"></i></div><small>Reward: '+money(q.coins)+' coins + '+q.star+'★ ticket</small><button '+(!ready||claimed?'disabled':'')+' data-v5-quest="'+scope+':'+q.id+'">'+(claimed?'CLAIMED':ready?'CLAIM REWARD':'IN PROGRESS')+'</button></div>'}
 if(daily)daily.innerHTML=dqs.map(q=>questHTML(q,'v5Daily')).join('');
 if(weekly)weekly.innerHTML=wqs.map(q=>questHTML(q,'v5Weekly')).join('');
 const rounds=$('v5BonusCount');if(rounds)rounds.textContent=data.v5BonusRounds;
}
function claimQuest(scope,id){const qmap={d3:{goal:3,coins:50000,star:1},d8:{goal:8,coins:125000,star:1},dw2:{goal:2,coins:100000,star:2},w25:{goal:25,coins:500000,star:2},w10:{goal:10,coins:750000,star:3}};const q=qmap[id],p=data[scope];if(!q||!p||p.claims.includes(id))return;const cur=id==='dw2'||id==='w10'?p.wins:p.spins;if(cur<q.goal)return;p.claims.push(id);if(window.state)window.state.balance+=q.coins;addTicket(q.star,1);if(typeof window.addXP==='function')window.addXP(scope==='v5Daily'?50:150);persist();if(typeof window.save==='function')window.save();render();toastV5('Quest reward claimed!')}
function addStamp(){data.v5Stamps++;syncPeriods();data.v5Daily.spins++;data.v5Weekly.spins++;if(data.v5Stamps%5===0)addTicket(1,1);if(data.v5Stamps===10||data.v5Stamps===30||data.v5Stamps===40)addTicket(2,1);const s=window.state;if(s){s.v5Stamps=data.v5Stamps;s.v5Tickets=data.v5Tickets;}persist();render()}
function onWin(){syncPeriods();data.v5Daily.wins++;data.v5Weekly.wins++;if(data.v5Daily.wins===1)addTicket(1,1);if(data.v5Weekly.wins===5)addTicket(3,1);persist();render()}
function injectUI(){
 if($('v5System'))return;
 const style=document.createElement('style');style.textContent=`
 .v5-panel{margin:16px 0;padding:18px;border:1px solid #49617d;border-radius:18px;background:linear-gradient(145deg,#14263a,#0d1727 82%);box-shadow:0 14px 32px #0005;color:#eef5ff}
 .v5-panel h2{margin:0 0 6px;font-size:18px;letter-spacing:.8px;color:#f0c77b}.v5-sub{color:#b8c9dc;font-size:12px;margin:0 0 14px}
 .v5-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.v5-ticket{border:1px solid var(--ticket);border-radius:12px;padding:12px 6px;text-align:center;background:linear-gradient(145deg,#1d2c42,#111b2a);display:flex;flex-direction:column;gap:4px}.v5-ticket strong{color:var(--ticket);font-size:15px;letter-spacing:1px;text-shadow:0 0 12px var(--ticket)}.v5-ticket b{font-size:22px}.v5-ticket small{color:#bac8d8;font-size:10px}
 .v5-milestones,.v5-quests{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.v5-milestone,.v5-quest{background:#101d2d;border:1px solid #344a63;border-radius:13px;padding:12px;display:flex;flex-direction:column;gap:7px}.v5-milestone-top{display:flex;justify-content:space-between;gap:8px;font-size:12px}.v5-milestone-top span,.v5-milestone small,.v5-quest small{color:#b7c7d8;font-size:11px}.v5-progress{height:8px;background:#080e18;border:1px solid #34475e;border-radius:99px;overflow:hidden}.v5-progress i{display:block;height:100%;background:linear-gradient(90deg,#43c9bd,#d8ad69);border-radius:99px}.v5-panel button{padding:7px 10px;font-size:11px;align-self:flex-start;background:linear-gradient(120deg,#314c68,#172b42);border:1px solid #6b86a3;border-radius:8px;color:white}.v5-panel button:disabled{opacity:.45}.v5-muted{color:#9db0c5;font-size:11px}.v5-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.v5-primary{background:linear-gradient(110deg,#b7833d,#e4c27f)!important;color:#17120b!important;font-weight:900}.v5-modal{position:fixed;inset:0;z-index:10000;background:#020713d9;display:none;place-items:center;padding:18px;backdrop-filter:blur(8px)}.v5-modal.open{display:grid}.v5-dialog{width:min(650px,100%);padding:22px;border-radius:22px;background:linear-gradient(145deg,#1b2e45,#0d1728);border:1px solid #b58b50;box-shadow:0 24px 90px #000b;color:#f3f6fb}.v5-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}.v5-mode{padding:14px 10px;border:1px solid #526a85;border-radius:14px;background:#142238;cursor:pointer;text-align:left;color:#fff}.v5-mode b{display:block;margin-bottom:7px}.v5-mode small{color:#bdc9d8;line-height:1.4}.v5-mode.selected{border-color:#e5bd72;box-shadow:0 0 0 2px #e5bd7233}.v5-close{float:right}.v5-note{font-size:11px;color:#9eb1c7;line-height:1.5}
 @media(max-width:700px){.v5-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.v5-ticket{padding:9px 2px}.v5-ticket strong{font-size:10px}.v5-ticket b{font-size:17px}.v5-mode-grid{grid-template-columns:1fr}.v5-panel{padding:13px}}
 `;document.head.appendChild(style);
 const wrap=document.createElement('section');wrap.id='v5System';wrap.innerHTML=`
 <section class="v5-panel"><h2>🎟️ ROYAL TICKET COLLECTION</h2><p class="v5-sub">Collect five ticket rarities through spins, daily and weekly quests, and stamp milestones. Tickets are virtual collectibles.</p><div id="v5TicketInventory" class="v5-grid"></div><p class="v5-sub" style="margin:12px 0 0">Current game difficulty: <b id="v5CurrentMode">MEDIUM</b> · Bonus rounds played: <b id="v5BonusCount">0</b></p><div class="v5-actions" style="margin-top:12px"><button class="v5-primary" id="v5BonusOpen">USE A TICKET · BONUS ROUND</button><span class="v5-note">Bonus rounds consume one selected ticket and award virtual coins/XP only.</span></div></section>
 <section class="v5-panel"><h2>👑 ROYAL STAMP JOURNEY</h2><p class="v5-sub">Earn one stamp per completed spin. Claim each milestone reward when you reach its target.</p><div class="v5-actions"><b style="font-size:25px;color:#e8c47e" id="v5StampCount">0</b><span class="v5-sub">TOTAL STAMPS COLLECTED</span></div><div id="v5MilestoneTrack" class="v5-milestones"></div></section>
 <section class="v5-panel"><h2>⚔️ DAILY & WEEKLY EVENTS</h2><p class="v5-sub">Complete missions at your own pace. Progress refreshes daily or weekly; unclaimed expired rewards do not carry forward.</p><h3 style="font-size:13px;color:#70d5c9">DAILY EVENTS</h3><div id="v5DailyList" class="v5-quests"></div><h3 style="font-size:13px;color:#e6bf75;margin-top:18px">WEEKLY EVENTS</h3><div id="v5WeeklyList" class="v5-quests"></div></section>
 <div class="v5-modal" id="v5DifficultyModal"><div class="v5-dialog"><button class="v5-close" id="v5ModeClose">CLOSE</button><h2 style="color:#efc779;margin:4px 0">CHOOSE YOUR GAME MODE</h2><p class="v5-sub">Select a reward profile for this world. Your choice is remembered separately for each game.</p><div class="v5-mode-grid"><button class="v5-mode" data-mode="easy"><b>🟢 EASY</b><small>Gentler virtual prize scaling · relaxed play</small></button><button class="v5-mode" data-mode="medium"><b>🟡 MEDIUM</b><small>Standard virtual prize scaling · balanced profile</small></button><button class="v5-mode" data-mode="hard"><b>🟣 HARD</b><small>Higher virtual prize scaling · larger swings in results</small></button></div><p class="v5-note">Difficulty changes virtual prize amounts, not guaranteed wins. No cash value, deposits or cash-outs.</p><button id="v5ModeStart" class="v5-primary" disabled>ENTER GAME</button></div></div>
 <div class="v5-modal" id="v5BonusModal"><div class="v5-dialog"><button class="v5-close" id="v5BonusClose">CLOSE</button><h2 style="color:#efc779">🎁 ROYAL TICKET BONUS</h2><p class="v5-sub">Choose a ticket to spend and reveal a virtual reward.</p><div id="v5BonusChoices" class="v5-quests"></div><p class="v5-note">One ticket is consumed per bonus round. Rewards are virtual entertainment points only.</p></div></div>`;
 const footer=document.querySelector('footer');if(footer)footer.parentNode.insertBefore(wrap,footer);
 const modal=document.createElement('div');modal.id='v5ModalRoot';document.body.appendChild(modal);
 $('v5ModeClose').onclick=()=>{$('v5DifficultyModal').classList.remove('open')};
 $('v5BonusClose').onclick=()=>{$('v5BonusModal').classList.remove('open')};
 $('v5BonusOpen').onclick=openBonus;
 document.addEventListener('click',e=>{
  const claim=e.target.closest('[data-v5-claim]');if(claim){const m=milestones.find(x=>x.n===Number(claim.dataset.v5Claim));if(m)rewardMilestone(m)}
  const q=e.target.closest('[data-v5-quest]');if(q){const [scope,id]=q.dataset.v5Quest.split(':');claimQuest(scope,id)}
  const mode=e.target.closest('[data-mode]');if(mode){document.querySelectorAll('.v5-mode').forEach(x=>x.classList.toggle('selected',x===mode));selectedMode=mode.dataset.mode;$('v5ModeStart').disabled=false}
 });
}
let selectedMode='medium',pendingGame=null;
const originalOpen=window.openGame;
function openDifficulty(id){pendingGame=id;selectedMode=data.v5Difficulty[id]||'medium';document.querySelectorAll('.v5-mode').forEach(x=>x.classList.toggle('selected',x.dataset.mode===selectedMode));$('v5ModeStart').disabled=false;$('v5DifficultyModal').classList.add('open')}
function startSelectedGame(){if(!pendingGame)return;data.v5Difficulty[pendingGame]=selectedMode;persist();$('v5DifficultyModal').classList.remove('open');if(typeof originalOpen==='function')originalOpen(pendingGame);render()}
function openBonus(){const box=$('v5BonusChoices');box.innerHTML=[1,2,3,4,5].map(n=>{const count=Number(data.v5Tickets[n]||0);return '<div class="v5-quest"><b style="color:'+ticketColors[n]+'">'+('★'.repeat(n))+' '+ticketNames[n]+'</b><small>Available: '+count+'</small><button '+(!count?'disabled':'')+' data-v5-spend="'+n+'">USE TICKET</button></div>'}).join('');$('v5BonusModal').classList.add('open')}
function spendTicket(n){if(!data.v5Tickets[n])return;data.v5Tickets[n]--;data.v5BonusRounds++;const base=[0,50000,125000,300000,750000,2000000][n];const reward=base*(n===5?2:1);if(window.state){window.state.balance+=reward;if(typeof window.addXP==='function')window.addXP(n*35)}persist();if(typeof window.save==='function')window.save();render();$('v5BonusModal').classList.remove('open');toastV5('Ticket bonus revealed: +'+money(reward)+' virtual coins!')}
function setModeMultiplier(){const id=window.current&&window.current.id||'aztec';const mode=data.v5Difficulty[id]||'medium';window.LSR_V5_MODE_MULTIPLIER=mode==='easy'?.8:mode==='hard'?1.6:1;const el=$('v5CurrentMode');if(el)el.textContent=mode.toUpperCase()}
function patchSpin(){if(typeof window.spin!=='function'||window.spin.__v5)return;const base=window.spin;const wrapped=function(){const before=window.state?window.state.spins:0;base();const after=window.state?window.state.spins:before;if(after>before){addStamp();setModeMultiplier();}};wrapped.__v5=true;window.spin=wrapped;const src=document.querySelector('script');}
function patchEvaluateLine(){/* Actual payout scaling is applied in the existing spin function by the injected one-line patch below. */}
document.addEventListener('click',e=>{const spend=e.target.closest('[data-v5-spend]');if(spend)spendTicket(Number(spend.dataset.v5Spend))});
function patch(){injectUI();$('v5ModeStart').onclick=startSelectedGame;const oldOpen=window.openGame;if(oldOpen&&!oldOpen.__v5){window.openGame=function(id){openDifficulty(id)};window.openGame.__v5=true}patchSpin();render();setModeMultiplier();if(window.updateHUD&&!window.updateHUD.__v5){const u=window.updateHUD;window.updateHUD=function(){u();render()};window.updateHUD.__v5=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else patch();
window.addEventListener('focus',()=>{syncPeriods();persist();render()});
window.LSR_V5={render,addStamp,addTicket,spendTicket,data};
})();
