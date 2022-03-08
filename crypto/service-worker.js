'use strict';

const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = ['wallet', 'wallet.html', 'wallet.css', 'strawicontrans.png', 'quotes.js', 'qrcode.js', 'qrscan.js', 'xno.js', 'nacl.js', 'sol.js', 'xlm.js', 'algo.js', 'tweetnacl.js'];

self.addEventListener('install', (evt) => {	
	self.skipWaiting();
	console.log("[sw] Trying to refresh pages automatically at install. This shouldn't work.");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			console.log("[sw] Refreshing a page at install.");
			tab.navigate(tab.url);
		});
	});
	
	console.log('[sw] Install');  	
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[sw] Adding new cache');
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener('activate', (evt) => {
	self.clients.claim();
	console.log("[sw] Trying to refresh pages automatically at activate. This will work.");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			console.log("[sw] Refreshing a page at activate.");
			tab.navigate(tab.url);
		});
	});
	
	console.log('[sw] Activate');	
	evt.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					console.log('[sw] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', (evt) => {
	if (evt.request.url.startsWith(self.location.origin)) evt.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
		return cache.match(evt.request, {ignoreSearch:true}).then((response) => {
			if (!response) console.log('[sw] Network fetch', evt.request.url);
			return response || fetch(evt.request).catch(() => {
				return cache.match('wallet.html');		
			});
		});
		})
	);
	else console.log('[sw] Outside fetch', evt.request.url);	
});
