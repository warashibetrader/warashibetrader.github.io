---
title: "Crypto Wallet support for invoices, receipts, and click-to-pay"
---

I added some features to my crypto wallet (https://warashibetrader.github.io/crypto/wallet). The most substantial upgrades include:

1. Support for Algorand.

2. An off-network system for recording payment invoices, receipts, and memos. This system is centralized. It can be argued that this is the way it should be: Decentralization should be reserved for those features for which people have an irresistable incentive to cheat. For memos, it's almost the other way around: The customer has an incentive that the merchant has an accurate invoice so that the order is processed smoothly.

3. Support for click to pay, programmatically populating out the wallet payment form with an invoice. For instance:

<button style="margin:20px" onclick='
	let preferred = "XNO";
	let addresses = {XNO: "nano_1gpquwssoy8491ajmxp9cxjb3o38imcxidissob7cxc38o6h6r4d8gg639b7"};
	let items = [{item:"Donation", XNO:"1"}];
	
	let popup = window.open('https://warashibetrader.github.io/crypto/wallet');
	window.addEventListener("message", function(event) {
		if (event.source == popup && event.data) {
			if (event.data.cue == "readyCue") popup.postMessage({cue:"replyCue", preferred:preferred, addresses: addresses, items: items}); 
			if (event.data.cue == "paidCue") {this.textContent = "Thank You!"};
			if (event.data.cue == "closeCue") popup.close();
		}
	});
'>Donate!</button>

