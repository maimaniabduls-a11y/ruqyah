// Cache page files only. MP3 remains online unless the listener saves it.
const CACHE='ruqyah-shell-v4';
const ASSETS=["./", "./index.html", "./en.html", "./ur.html", "./style.css", "./script.js", "./script-en.js", "./script-ur.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./hi.html", "./script-hi.js", "./sd.html", "./script-sd.js", "./id.html", "./script-id.js", "./tr.html", "./script-tr.js", "./bn.html", "./script-bn.js"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ruqyah-shell-')&&key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(url.pathname.endsWith('.mp3')||event.request.method!=='GET')return;if(url.origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});



