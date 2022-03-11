---
title: "End-to-end encryption of invoices and receipts"
---

[Transact](https://transactcc.github.io/) now supports end-to-end encryption of invoice and receipt data.

But if encryption is supported, why would this data ever need to be public (as sometimes indicated when trying to make a transfer)?

End-to-end encryption requires both parties to first set up a "secure mailbox," which in the digital setting means to generate and publish a public encryption key. This is easy to do on Transact; it happens automatically when a user sets a display name, or conducts their first transaction on Transact. But an account which has completed neither, and in particular has never used Transact, will not be able to receive encrypted invoice or receipt data.

#### I'm sending to an address which has a public display name already. Why isn't the receipt encrypted?

Transact also populates display names using some public databases. These will display even if the account has never used Transact.

#### How public is a "public" receipt?

The receipt will be in plaintext in Transact's database, but it will not be deliberately published anywhere.
