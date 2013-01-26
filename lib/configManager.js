var configManager = {
	createConfig : function(username, password){
		config.name = username;
		config.key = cryptico.generateRSAKey(username+password,512);
		config.pubkey = cryptico.publicKeyString(config.key);
		config.sha1 = Sha1.hash(username+password, false);
		config.ssha1 = Sha1.hash(username+password+username, false);
		config.friendList = [];
		configManager.putConfLocal();
	},
	/*
	*	Attempts to recover the config from	localStorage, DHT
	*	then proposes to create an account
	*	
	*/
	logIn : function(username, password){
		var tmpConf;
		try{
			//Check if user is in LocalStorage
			tmpConf = JSON.parse(sjcl.decrypt(
				Sha1.hash(username+password,false),
				localStorage.getItem(Sha1.hash(username,false))
			));
			config = tmpConf;
			console.log("Recovered config from localStorage");
			log("Hello, "+config.name);
			return;
		}catch(err){
			console.log("Could not recover the config from localStorage"+err);
			node.get(Sha1.hash(username+password+username,false), function(value){
				try{
					config = JSON.parse(sjcl.decrypt(Sha1.hash(username+password,false), value));
					configManager.putConfLocal();
					console.log("Recovered config from DHT");
					log("Hello, "+config.name);
					return;
				}catch(err){
					console.log("Could not recover the config from DHT"+err);
					if (confirm("No such user found, do you want to create an account ?")){
						log("Generating keys, this may take some time");
						configManager.createConfig(username, password);
						if (1 == configManager.putConfLocal()){	console.log("putConfLocal() failed");}
						if (1 == configManager.putConfDHT()){	console.log("putConfDHT() failed");}
						console.log("Created config");
						log("Hello, "+config.name);
						return;
					}else{
						log("Could not load your configuration, please try again.");
						return;
					}
				}
			});
		}
	},
	addFriend : function(name, key){
		if (!config) return 1;

		var friend = {
			"name"	:	name,
			"key"	:	key,
			"address":	Sha1.hash(name+key)
		};
		config.friendList.push(friend);
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
		node.put(config.ssha1, secConfig, lifetime, function(value, size){
			if (size == 0){
				node.checkConnectivity();
				return 1;
			}else{
				console.log("Configuration succesfully saved on the DHT");
				return 0;
			}
		});
	}
}
