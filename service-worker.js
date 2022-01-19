'use strict';

const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = ['wallet.html', 'wallet.css', 'strawicontrans.png', 'nanocurrency.js'];

self.addEventListener('install', (evt) => {
	console.log('[ServiceWorker] Install');
  
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Pre-caching offline page');
			return cache.addAll(FILES_TO_CACHE);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	console.log('[ServiceWorker] Activate');
	
	evt.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	//self.clients.claim();
	console.log("trying to refresh pages automatically");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			// ...and refresh each one of them
			tab.navigate(tab.url)
		});
	});
});

self.addEventListener('fetch', (evt) => {
	console.log('[ServiceWorker] Fetch', evt.request.url);	
	if (evt.request.url.startsWith(self.location.origin)) {
	evt.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
		return cache.match(evt.request).then((response) => {
			if (response) console.log('[ServiceWorker] Cache fetched', evt.request.url);
			return response || fetch(evt.request).catch(() => {
				return caches.open(CACHE_NAME).then((cache) => {
					return cache.match('wallet.html');
				});							
			})
		});
		})
	);
	}
	else console.log('[ServiceWorker] Skipping fetch', evt.request.url);	
});

