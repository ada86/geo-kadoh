var configManager = {
	createConfig : function(username, password){
		config = {};
		config.name = username;
		config.key = cryptico.generateRSAKey(username+password,512);
		config.pubkey = cryptico.publicKeyString(config.key);
		config.sha1 = Sha1.hash(username+password, false);
		config.ssha1 = Sha1.hash(username+password+username, false);
		config.friendList = [];
		configManager.putConfLocal();
	},
	/*
	*	Attempts to recover the config from	
	*	localStorage, DHT
	*	then proposes to create an account
	*	
	*/
	logIn : function(){
		var username = document.getElementById('myName').value,
		password = document.getElementById('password').value,
		offline = document.getElementById('remember-me').checked;
		console.log(offline);
		var tmpConf;
		try{//Check if user is in LocalStorage
			tmpConf = JSON.parse(sjcl.decrypt(
				Sha1.hash(username+password,false),
				localStorage.getItem(Sha1.hash(username,false))
			));
			config = tmpConf;
			console.log("Recovered config from localStorage");
			log("High Five, "+config.name);
			document.getElementById('loggedin').innerHTML="Logged in as "+config.name;
			return;
		}catch(err){
			node.get(Sha1.hash(username+password+username,false), function(value){
				try{
					config = JSON.parse(sjcl.decrypt(Sha1.hash(username+password,false), value));
					configManager.putConfLocal();
					console.log("Recovered config from DHT");
					log("High Five"+config.name);
					document.getElementById('loggedin').innerHTML="Logged in as "+config.name;
					return;
				}catch(err){
					console.log("User "+config.name+" not found ("+err+")");
					if (confirm("No such user found, do you want to create an account ?")){
						configManager.createConfig(username, password);
						if (offline){configManager.putConfLocal();}
						if (1 == configManager.putConfDHT()){console.log("Could not save the config on the DHT");}
						console.log("Created config");
						log("Welcome, "+config.name);
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
