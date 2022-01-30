'use strict';

const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = ['wallet', 'wallet.html', 'wallet.css', 'strawicontrans.png', 'xno.js', 'nacl.js', 'quotes.js', 'qrcode.js', 'qrscan.js'];

self.addEventListener('install', (evt) => {	
	console.log("trying to refresh pages automatically at install");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			console.log("Refreshing a page at install");
			tab.navigate(tab.url);
		});
	});
	
	self.skipWaiting();
	console.log('[sw] Install');  	
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[sw] Pre-caching offline page');
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener('activate', (evt) => {
	console.log("trying to refresh pages automatically at activate");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			console.log("Refreshing a page at activate");
			tab.navigate(tab.url);
		});
	});
	
	self.clients.claim();
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
		return cache.match(evt.request).then((response) => {
			if (response) console.log('[sw] Cache fetched', evt.request.url);
			else console.log('[sw] Network fetched', evt.request.url);
			return response || fetch(evt.request).catch(() => {
				return cache.match('wallet.html');		
			});
		});
		})
	);
	else console.log('[sw] Outside fetch', evt.request.url);	
});
