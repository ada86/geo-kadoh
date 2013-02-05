//This is newer
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
		log("Please wait while looking for the configuration online.");
		node.get(Sha1.hash(username+password+username,false), function(value){
			try{
				config = JSON.parse(sjcl.decrypt(Sha1.hash(username+password,false), value));
				config.key = cryptico.generateRSAKey(username+password,512);
				configManager.putConfLocal();
				console.log("Recovered config from DHT");
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
					log("The configuration was taken from localStorage, it may not be up to date !");
				}catch(err){
					console.log("Could not find the config in localStorage : "+err);
					if (confirm("Wrong user/password. If you don't have an account, create one by selecting OK.")){
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
		node.put(config.ssha1, secConfig, lifetime, function(value, size){
			if (size == 0){
				return 1;
			}else{
				console.log("Configuration succesfully saved on the DHT");
				return 0;
			}
		});
	}
}
