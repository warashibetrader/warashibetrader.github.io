---
title: "Crypto wallet support for invoices, receipts, memos, and click-to-pay"
---

I added some features to my [crypto wallet](https://transactcc.github.io/). The most substantial upgrades include:

1. Support for Algorand.

2. The option to upload a security image as an alternative to a security quote.

3. An off-network database for recording payment invoices, receipts, and memos. This database is centralized. It can be argued that this is the way it should be: Decentralization should be reserved for those features for which people have an irresistable incentive to cheat. For memos, it's almost the other way around, because the customer has an incentive that the merchant has an accurate invoice so that the order is processed smoothly.

4. Support for click to pay, programmatically populating the wallet payment form with an invoice. For instance:

<div style="text-align:center">
<button id="donateButton" style="margin:20px" onclick='
	let preferred = "XNO";
	let addresses = {XNO: "nano_1gpquwssoy8491ajmxp9cxjb3o38imcxidissob7cxc38o6h6r4d8gg639b7", 
			 BAN: "ban_1gpquwssoy8491ajmxp9cxjb3o38imcxidissob7cxc38o6h6r4d8gg639b7"};
	let items = [{item:"Donation to the developer", XNO:"1", BAN:"100"}, {item:"A memo"}]; 
	let popup = window.open("https://transactcc.github.io/");
	window.addEventListener("message", function(event) {
		if (event.source == popup && event.data) {
			if (event.data.cue == "readyCue") popup.postMessage({cue:"replyCue", preferred:preferred, addresses: addresses, items: items}); 
			if (event.data.cue == "paidCue") document.getElementById("donateButton").textContent = "Thank You!";
			if (event.data.cue == "closeCue") popup.close();
		}
	});
'>Donate!</button>
</div>




Below is the javascript code that is triggered by clicking the donation button. The code runs in any javascript-enabled context, with no dependencies or installation required of you or your clients. 
  
		
	// Fill out preferred currency, addresses, items (currently only the preferred currency will be accepted)
	let preferred = "XNO";
	let addresses = {XNO: "nano_1gpquwssoy8491ajmxp9cxjb3o38imcxidissob7cxc38o6h6r4d8gg639b7", 
			 BAN: "ban_1gpquwssoy8491ajmxp9cxjb3o38imcxidissob7cxc38o6h6r4d8gg639b7"};
	let items = [{item:"Donation to the developer", XNO:"1", BAN:"100"}, {item:"A memo"}]; 

	// The below can be used as-is for a basic implementation, but a confirmation event is exposed below if needed
	let popup = window.open("https://transactcc.github.io/");
	window.addEventListener("message", function(event) {
	if (event.source == popup && event.data) {
		if (event.data.cue == "readyCue") {
			popup.postMessage({cue:"replyCue", preferred:preferred, addresses: addresses, items: items}); 
		}
		if (event.data.cue == "paidCue") { 
			// Confirmed transaction's network ID is exposed in event.data.id 
		}
		if (event.data.cue == "closeCue") { 
			popup.close();  
			// Confirmed transaction's network ID is exposed in event.data.id 
		}
	}
	});
