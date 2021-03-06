var configManager = {
	createConfig : function(username, password){
		config = {};
		config.name = username;
		config.key = cryptico.generateRSAKey(username+password,512);
		config.pubkey = cryptico.publicKeyString(config.key);
		config.sha1 = Sha1.hash(username+password, false);
		config.ssha1 = Sha1.hash(username+password+username, false);
		config.friendList = [
			{name : username,
			key : config.pubkey,
			lastPos : null}
		];
		config.groupList = [
		];
		configManager.putConfLocal();
		if (1 == configManager.putConfDHT()){console.log("Could not save the config on the DHT");}
		window.setInterval(configManager.putConfDHT, 10*1000);//periodically update/refresh the conf on the DHT
		console.log("Created config");
		log("Welcome, "+config.name);
		htmlEvents.loggedIn();
	},
	/*
	*	Attempts to recover the config from	
	*	localStorage, DHT
	*	then proposes to create an account
	*
	*/
	logIn : function(){
		var username = document.getElementById('myName').value,
		password = document.getElementById('password').value;
		if (password == ""){log("Please type a password");return}
		config = undefined;
		console.log("Please wait while looking for the configuration online.");
		node.get(Sha1.hash(username+password+username,false), function(value){
			try{
				config = JSON.parse(sjcl.decrypt(Sha1.hash(username+password,false), value));
				reviveKey(config.key);
				for (g in config.groupList){
					reviveKey(config.groupList[g].key);
				}
				console.log("Recovered config from DHT");
				configManager.putConfLocal();
				window.setInterval(configManager.putConfDHT, 10*1000);//periodically update/refresh the conf on the DHT
				log("Nice to see you again, "+config.name); 
			}catch(err){
				console.log("User was not found on the DHT : "+err);
				try{
					var tmpConf = JSON.parse(sjcl.decrypt(
						Sha1.hash(username+password,false),
						localStorage.getItem(Sha1.hash(username,false))
					));
					tmpConf.key = cryptico.generateRSAKey(username+password,512);
					config = tmpConf;
					console.log("Recovered config from localStorage");
					window.setInterval(configManager.putConfDHT, 10*1000);//periodically update/refresh the conf on the DHT
					log("The configuration was taken from localStorage, it may not be up to date !");
				}catch(err){
					console.log("Could not find the config in localStorage : "+err);
					if (confirm("Wrong user/password. If you don't have an account, create one by selecting OK.")){
						alert("Generating key, this can take a long time on mobile");
						configManager.createConfig(username, password);
					}
					return;
				}
			}
			htmlEvents.loggedIn(); return;
		});
	},
	putConfLocal : function(){
		if (!config) return 1;//Check if there is actually a config

		localStorage.setItem(
			Sha1.hash(config.name,false),
			sjcl.encrypt(config.sha1, JSON.stringify(config))
		);
		console.log("Configuration succesfuly stored on localStorage");
		return 0;//Success
	},
	putConfDHT : function(){
		if (!config) return 1;
		
		var secConfig = sjcl.encrypt(config.sha1, JSON.stringify(config));
		var lifetime = -1;
		node.put(config.ssha1, secConfig, lifetime, function(value, peers){
			if (peers == null || peers.size() == 0){
				console.log("Could not save the config on the DHT !");
				return 1;
			}else{
				//console.log("Configuration succesfully saved on the following nodes : ");
				//console.log(peers);
				return 0;
			}
		});
	}
}
function reviveKey(key){
	key.__proto__ = RSAKey.prototype;
	key.coeff.__proto__ = BigInteger.prototype;
	key.d.__proto__ = BigInteger.prototype;
	key.dmp1.__proto__ = BigInteger.prototype;
	key.dmq1.__proto__ = BigInteger.prototype;
	key.n.__proto__ = BigInteger.prototype;
	key.p.__proto__ = BigInteger.prototype;
	key.q.__proto__ = BigInteger.prototype;
};
var globalPrKey = JSON.parse(
	'{"n":{"t":19,"9":11587753,"8":250755721,"7":199823100,"6":72437070,"5":200308144,"4":43090306,"3":18543843,"2":193042920,"1":222521366,"0":36540827,"10":97329041,"11":56570977,"12":29847421,"13":216097879,"14":136418694,"15":59292164,"16":265339044,"17":5114365,"18":114,"19":0,"s":0},"e":3,"d":{"t":19,"s":0,"0":14118587,"1":82992775,"2":101510474,"3":267170077,"4":224637758,"5":56692081,"6":92826884,"7":157076991,"8":267035018,"9":97203639,"10":64886027,"11":127192470,"12":198855251,"13":144065252,"14":90945796,"15":218485080,"16":87414210,"17":3409577,"18":76},"p":{"t":10,"s":0,"0":58378159,"1":11479552,"2":106990354,"3":30918771,"4":116507438,"5":132059753,"6":207622932,"7":46548201,"8":131423280,"9":13},"q":{"t":10,"s":0,"0":91202517,"1":86552651,"2":68004583,"3":123740868,"4":260714869,"5":251645723,"6":128226995,"7":186094867,"8":121433097,"9":8},"dmp1":{"19":5,"18":170433883,"17":213541730,"16":85484663,"15":257242301,"14":84331427,"13":171972397,"12":134814874,"11":57701767,"10":150280162,"9":8,"8":266572490,"7":209989105,"6":48936802,"5":266996806,"4":77671625,"3":110090999,"2":160805388,"1":7653034,"0":217875743,"t":10,"s":0},"dmq1":{"19":8,"18":266572490,"17":209989105,"16":48936802,"15":266996806,"14":77671625,"13":110090999,"12":160805388,"11":7653034,"10":217875742,"9":5,"8":170433883,"7":213541730,"6":85484663,"5":257242301,"4":84331427,"3":171972397,"2":134814874,"1":57701767,"0":150280163,"t":10,"s":0},"coeff":{"t":10,"s":0,"0":235249724,"1":10165100,"2":253188008,"3":28082953,"4":110470834,"5":232663991,"6":215196920,"7":182761138,"8":240194075,"9":3,"t":10,"s":0}}'
);
reviveKey(globalPrKey);
var globalPuKey = cryptico.publicKeyString(globalPrKey);
