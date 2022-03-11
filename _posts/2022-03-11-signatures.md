---
title: "Invoice and receipt signatures"
---

[Transact](https://transactcc.github.io/) now supports cryptographic signatures on invoices and receipts.

The invoicer has the option of signing their invoice with their cryptocurrency private key. The signature is attached to the invoice URL, and Transact automatically validates the signature when a customer loads an invoice URL. The presence of a validated signature is indicated on the pre-payment summary panel.

Receipts are always signed by the sender. The rationale for this is that the sender both initiates and finalizes payments in cryptocurrency systems. If they would rather not sign the receipt, then they can simply refrain from performing the transaction. (Note that receipts are [end-to-end encrypted]({% post_url 2022-03-05-end-to-end-encryption %}), so privacy concerns should not be a barrier.)
