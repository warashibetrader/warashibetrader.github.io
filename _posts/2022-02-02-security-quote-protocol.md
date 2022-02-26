---
title: "A security quote protocol for regulating web application updates"
---

The problem with using web apps for secure applications is that every time you visit the app, its code is newly downloaded and may be different from the trusted version you used last. The fact that the present app doesn't disappear with your private information in hand is not an expectation - just a pleasant surprise.

The _security quote protocol_ solution in a nutshell: The app's code selects a random quote or image on the client's first visit, and does _not_ expose the selection to the server. It shows this quote to the user each time the app loads. If the app is updated, the quote is deleted immediately. The user then knows that the app's code has been updated, and proceeds with caution.

Implications: The protocol achieves a trust-on-first-use security model. This makes a browser web app as secure as a native app or browser extension.



### Background reading

There is a decent amount of discussion about the problem with browser cryptography, especially in the end-to-end encryption community:

[What’s wrong with in-browser cryptography?](https://tonyarcieri.com/whats-wrong-with-webcrypto]): This is an older article from 2013, but the section titled "The Ugly" is still relevant:

> The convenience of the web stems from the fact it’s a frictionless application delivery platform. Unfortunately, it does not rely on a comprehensive cryptographically secure signature system to determine if content is authentic, but instead just trusts whatever is sitting around on the server at the time you access it. This is worsened by the fact that web browsers give remote servers access to wide-ranging local capabilities exposed via HTML and JavaScript. This creates an environment that is not particularly safe or stable for use in creating, storing, or sharing encryption keys or encrypted messages.

[What’s wrong with in-browser cryptography in 2017?](https://security.stackexchange.com/questions/173620/what-s-wrong-with-in-browser-cryptography-in-2017): The answers here are quite good. Ajedi32 summarizes the problem nicely:

> The main issue with cryptography in web pages is that, because the code you're executing is loaded from a web server, that server has full control over what that code is and can change it every time you refresh the page. Unless you manually inspect the code you're running every time you load a new page on that site (preferably before that code is actually executed), you have no way of knowing what that code will actually do.

[Browser End-to-End Encryption](https://www.cryptologie.net/article/460/browser-end-to-end-encryption/): This blog post acknowledges the problem and proposes the natural but flawed solution:

> Back to the question: can we provide end-to-end encryption with a web app? There are ways, yes. You can for example create a one-page javascript web application, and have the client download it. In that sense it could be a "trust on first use" kind of application, because later you would only rely on your local copy. If you want to make it light, have the page use remotely served javascript, images, and other files and protect manipulations via the subresource integrity mechanism of web browsers (include a hash of the file in the single-page web app). It is not a "bad" scenario, but it's not the flow that most users are used to. And this is the problem here. We are used to accessing websites directly, install whatever, and update apps quickly.

[Solution to the ‘Browser Crypto Chicken-and-Egg Problem’?](https://security.stackexchange.com/questions/238441/solution-to-the-browser-crypto-chicken-and-egg-problem): This post introduces the chicken and egg terminology:

> In discussions around this subject, the ‘browser crypto chicken-and-egg problem’ frequently comes up. The term was coined in 2011 by security researcher Thomas Ptacek. In essence, the problem is: if you can't trust the server with your secrets, then how can you trust the server to serve secure crypto code? Using Protonmail as an example, one could argue that a rogue Protonmail server admin (or an attacker that has gained access to Protonmail’s servers) could alter the client-side javascript code served by Protonmail’s server, such that the code captures the user’s private keys or plaintext information and sends these secrets back to the server (or somewhere else).

[Why is there no web client for Signal?](https://security.stackexchange.com/questions/238011/why-is-there-no-web-client-for-signal): A discussion about the problem of browser cryptography using the Signal messaging app as a case study:

> However, the larger problem here is that the SSL connection, as well as the content being served, is controlled by the Signal server. This means that if the server is compromised or goes rogue (which can easily be achieved by a government serving Signal a subpoena or the like), then it can easily modify the javascript files served to the client in a way that allows them to intercept the communications. This effectively defeats the point of end-to-end encryption, which is that nobody other than the sender and the recipient should be able to read the contents of the communication, since the server now has the power to compromise the communications at will.

[Web App for Signal](https://community.signalusers.org/t/web-app-for-signal/1272): A long discussion about why there is no web app for Signal. Keep in mind some discussion here is wrong. But on the other hand, some information is very on-point, like this comment by jespertheend:

> Actually my point was that the behaviour you are describing is now possible in browsers. To load code once, and then to never request anything from the server ever again. Everything single request is cached once, and then loaded from the users own computer forever. Until an update is available, in which case it would verify this update just like how a downloaded binary would verify an update. 
> 
> However, it seems like I missed one important detail. At the moment it is actually not possible to prevent an update client side when the server sends a new service worker to the client. This would make it impossible to verify if an update is trusted, the client would update regardless of whether or not the signature of the updated code is valid.

### A comparison with native apps and browser extensions

To understand the issues with web app security, it is helpful to benchmark against native apps and browser extensions. Native apps have two key security advantages over web apps:

1. Native apps are verified by a third party, typically Google or Apple. Precisely, an Android app has an extra layer of security because you typically obtain its code from the Google Play Store, rather than directly from the developer. If you trust Google, then this is an advantage because Google audits the app's code before distributing it.

2. The code is downloaded to your device and cannot be changed by the developer.

There is no shortcut to achieving (1) for web apps. An audit is an audit, and a third party is needed. (In the crypto space, this is not necessarily an issue. Developers are very active in the space and presumably keen to audit new code.)

Achieving (2) for web apps is the topic of this article. Before proceeding, a remark: (2) is evidently not true in the literal sense, even for native apps. The developer can of course update the code. However, this update needs to be submitted through the Google App Store again, and the client gets to decide whether to adopt the update or not. For the purposes of this discussion, the update can be viewed as the installation of an entirely new app.

### Caching and service workers

Caching seems like a promising solution to (2) above, since caching is, quite literally, downloading code to your device and using it. However, caching is typically automated by the browser, with no visibility for the client. In particular, the browser may delete the cache at will, negating any intended security implications. 

This brings us to the relatively well-established service worker paradigm. In a nutshell, a service worker is a script which gives full control of the cache to the client.

The solution to (2) thus appears to be in sight: A web app developer can write (auditable) service worker code which refuses to update the cache containing the web app's code. The web app would then enjoy the security properties of a native app, at least with respect to (2).

### The service worker code itself

The missing piece in the above proposal is that the service worker is itself a piece of code. It turns out that browsers do not allow clients to use caching to control service worker code. Precisely, the server always has full control over the service worker's code.

There is a good reason for this: If the service worker was allowed to halt updates to itself, a developer could accidentally "brick" their web app. Only the client would be able to remove the "broken" service worker code, to then receive repaired updates. This is not a user experience that browsers would like to allow, and so the situation is unlikely to change.


### The security quote protocol

As discussed, browsers currently do not allow clients to halt the update of a service worker. However, they _do_ notify the client before the update is installed. Precisely, the installation of a new service worker fires a javascript event which triggers the [onupdatefound EventListener](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/onupdatefound). 

This seems to be the key for a working solution. The _security quote protocol_ outlined at the beginning of this article is to respond to the onupdatefound event by deleting a security quote familiar to the end-user. This implicitly forces the app to reveal updates to the user.

Some additional Q&A:

#### Why not just put up an update notification when the onupdatefound event is received?

Malicious code could quickly take down any notification before the end-user sees it. In contrast, it cannot restore a quote it does not know.

#### Why a quote?

Quotes are lightweight and memorable. But a "security image," uploaded by the user, could serve the same purpose. On one hand, an image could be more memorable and hence more effective. On the other hand, this would require a little more work by the user.

#### Could the installation of a malicious service worker "frontrun" the deletion of the security quote?

In principle, yes. This is an empirical question that depends on how each browser prioritizes execution. For a malicious service worker to overcome a security quote, it would need to both

1. Install itself, and
2. halt client code in motion,

before the client code can successfully delete its security quote. I have tested this, and it seems that this is not possible in major browsers.

#### Is this an officially recognized protocol?

No; I'm proposing it now. As an example, I have implemented it in this [crypto wallet](https://transactcc.github.io/).
