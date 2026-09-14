const CACHE='community-bank-deposit-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
const LOGO='https://communitybankbd.com/wp-content/uploads/2021/02/Community-Bank-Final-Logo.png';

self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(async c=>{
    await c.addAll(ASSETS);
    try { await c.add(LOGO); } catch(e) {}
  }).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{
    const copy=x.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return x;
  }).catch(()=>caches.match('./index.html')))
));
