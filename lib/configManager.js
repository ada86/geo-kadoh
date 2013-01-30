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
		password = document.getElementById('password').value,
		offline = document.getElementById('remember-me').checked;
		if (password == ""){log("Please type a password");return}
		else console.log(password);
		var tmpConf;
		try{//Check if user is in LocalStorage
			console.log("Looking for "+username+", password : "+password);
			tmpConf = JSON.parse(sjcl.decrypt(
				Sha1.hash(username+password,false),
				localStorage.getItem(Sha1.hash(username,false))
			));
			tmpConf.key = cryptico.generateRSAKey(username+password,512);
			config = tmpConf;
			console.log("Recovered config from localStorage");
		}catch(err){
			console.log("User was not in local storage : "+err);
			node.get(Sha1.hash(username+password+username,false), function(value){
				try{
					config = JSON.parse(sjcl.decrypt(Sha1.hash(username+password,false), value));
					config.key = cryptico.generateRSAKey(username+password,512);
					configManager.putConfLocal();
					console.log("Recovered config from DHT");
					if (offline){configManager.putConfLocal();}
				}catch(err){
					console.log("Wrong user/password");
					if (confirm("Wrong user/password. If you don't have an account, create one by selecting OK.")){
						configManager.createConfig(username, password);
					}
					return;
				}
				log("Nice to see you again, "+config.name); htmlEvents.loggedIn(); return;
			});
		}
		if (typeof config == "object"){log("Nice to see you again, "+config.name); htmlEvents.loggedIn(); return;}
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
