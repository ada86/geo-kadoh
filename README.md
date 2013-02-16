geo-kadoh
=========
Web application using [KadOH](https://github.com/jinroh/kadoh) to provide location sharing functionalities on a Kademlia DHT.
This application is currently used as a replacement for [KadOH's boilerplate jake app](https://github.com/jinroh/kadoh/tree/master/apps/boilerplate/static) .

[Prezi presentation](http://prezi.com/cnvytqs2azhn/geo-kadoh/?kw=view-cnvytqs2azhn&rc=ref-30232747)

index.html

bootstrap	: to make it nice and shiny

lib : 

+ checkIn	: handles geolocation, location retrieval/storage on the DHT
+ configManager	: handles user's profile and friend/group list
+ htmlEvents	: HTML-heavy functions
+ kadohInit	: connects to the DHT, creates some global variables
+ listManager	: prints the dropdown menu lists
+ posUtils	: position encryption/decryption, map utilities

utils : external libraries

+ cryptico	: AES encryption
+ sha1		: SHA1 hashing
+ sjcl		: RSA encryption and key generation
