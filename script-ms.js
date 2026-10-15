"use strict";
const audio = document.getElementById('audio');
const play = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const seek = document.getElementById('seek');
const elapsed = document.getElementById('elapsed');
const remaining = document.getElementById('remaining');
const status = document.getElementById('status');
const repeat = document.getElementById('repeat');
const speed = document.getElementById('speed');
const speeds = [1, 1.25, 1.5, 0.75];
let speedIndex = 0;
let dragging = false;
function fmt(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const t = Math.floor(Math.max(0, seconds));
  return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
}
function update() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 2786.904;
  if (!dragging) seek.value = String(Math.round(1000 * audio.currentTime / duration));
  elapsed.textContent = fmt(audio.currentTime);
  remaining.textContent = '−' + fmt(duration - audio.currentTime);
  playIcon.innerHTML = audio.paused ? '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>' : '<path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>';
  play.setAttribute('aria-label', audio.paused ? "Main" : "Jeda");
  status.textContent = audio.error ? "Rakaman tidak dapat dimuatkan. Semak sambungan internet anda." : audio.paused ? "Rakaman dijeda" : "Ruqyah sedang dimainkan";
}
play.addEventListener('click', async () => { try { if (audio.paused) await audio.play(); else audio.pause(); } catch(e) { status.textContent="Audio tidak dapat dimainkan. Semak sambungan atau cuba pelayar lain."; return; } update(); });
document.getElementById('back').addEventListener('click', () => {audio.currentTime=Math.max(0,audio.currentTime-10); update();});
document.getElementById('forward').addEventListener('click', () => {if(Number.isFinite(audio.duration))audio.currentTime=Math.min(audio.duration,audio.currentTime+10);update();});
seek.addEventListener('input', () => { dragging=true; elapsed.textContent=fmt((Number(seek.value)/1000)*(Number.isFinite(audio.duration)?audio.duration:2786.904)); });
seek.addEventListener('change', () => { if(Number.isFinite(audio.duration)) audio.currentTime=(Number(seek.value)/1000)*audio.duration; dragging=false; update(); });
repeat.addEventListener('click', () => {audio.loop=!audio.loop;repeat.setAttribute('aria-pressed',String(audio.loop));repeat.title=audio.loop?"Ulangan dihidupkan":"Ulangan dimatikan";});
speed.addEventListener('click', () => {speedIndex=(speedIndex+1)%speeds.length;audio.playbackRate=speeds[speedIndex];speed.textContent=speeds[speedIndex]+'×';});
document.getElementById('share').addEventListener('click', async () => {
 const data={title:document.title,text:"Ruqyah syar’iyyah oleh Mufti Junaid",url:location.href};
 try {if(navigator.share) await navigator.share(data); else if(navigator.clipboard && location.protocol==='https:'){await navigator.clipboard.writeText(location.href);status.textContent="Pautan halaman disalin";} else {status.textContent="Salin pautan daripada bar alamat pelayar";}}catch(e){if(e.name!=='AbortError')status.textContent="Anda boleh menyalin pautan daripada bar alamat pelayar";}
});
audio.addEventListener('timeupdate',update);
audio.addEventListener('loadedmetadata',update);
audio.addEventListener('play',update);
audio.addEventListener('pause',update);
audio.addEventListener('ended',update);
audio.addEventListener('error',update);
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
if('mediaSession' in navigator) {
 navigator.mediaSession.metadata = new MediaMetadata({title:"Ruqyah Syar’iyyah",artist:"Mufti Junaid",artwork:[{src:'icon-512.png',sizes:'512x512',type:'image/png'}]});
 for(const [action,fn] of [['play',()=>audio.play()],['pause',()=>audio.pause()],['seekbackward',()=>audio.currentTime=Math.max(0,audio.currentTime-10)],['seekforward',()=>audio.currentTime=Math.min(audio.duration,audio.currentTime+10)]])try{navigator.mediaSession.setActionHandler(action,fn);}catch(e){}
}
update();




