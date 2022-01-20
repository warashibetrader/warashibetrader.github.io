'use strict';

const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = ['wallet', 'wallet.html', 'wallet.css', 'strawicontrans.png', 'nanocurrency.js', 'quotes.js'];

console.log("trying to refresh pages automatically at start");
self.clients.matchAll({type: 'window'}).then(function(tabs) {
	tabs.forEach((tab) => {
		console.log("Refreshing a page at start");
		tab.navigate(tab.url);
	});
});

self.addEventListener('install', (evt) => {	
	console.log("trying to refresh pages automatically at install");
	self.clients.matchAll({type: 'window'}).then(function(tabs) {
		tabs.forEach((tab) => {
			console.log("Refreshing a page at install");
			tab.navigate(tab.url);
		});
	});
	
	self.skipWaiting();
	console.log('[ServiceWorker] Install');  	
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Pre-caching offline page');
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
});

self.addEventListener('fetch', (evt) => {
	console.log('[ServiceWorker] Fetch', evt.request.url);	
	if (evt.request.url.startsWith(self.location.origin)) {
		evt.respondWith(
			caches.open(CACHE_NAME).then((cache) => {
			return cache.match(evt.request).then((response) => {
				if (response) console.log('[ServiceWorker] Cache fetched', evt.request.url);
				else console.log('[ServiceWorker] Network fetched', evt.request.url);
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

