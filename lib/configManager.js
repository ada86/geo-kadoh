var configManager = {
	createConfig : function(username, password){
		config = {}; //Does this actually have any use apart from resetting the config ?
		config.name = username;
		config.key = cryptico.generateRSAKey(username+password,512);
		config.pubkey = cryptico.publicKeyString(config.key);
		config.sha1 = Sha1.hash(username+password, false)
	},
	/*
	*	Will attempt to recover the config from	localStorage, DHT
	*	then propose to create an account
	*/
	logIn : function(username, password){
		var tmpConf;
		//Check if user is in LocalStorage
		tmpConf = localStorage.getItem(
			Sha1.hash(username,false)
		);
		recoverFromLocal : if (tmpConf != null){ //Just a label in case the decryption doesn't work
			try{
				tmpConf = JSON.parse(sjcl.decrypt(username+password, tmpConf));
			}catch(err){
				if (confirm("Are you sure you typed the right username/password ?"))
					break recoverFromLocal;
				else
					return;
			}
			config = tmpConf;
			log("Hello, "+config.name);
			return;
		}
		//TODO:Attempt to recover from DHT
		if (confirm("No such user found, do you want to create an account ?")){
			log("Generating keys, this may take some time");//TODO:Doesn't appear, hangs on the "confirm" until the config is created
			configManager.createConfig(username, password);
			configManager.setConfLocal();//Make sure to copy the configuration on the localStorage (maybe ask for user's permission?)
			log("Hello, "+config.name);
		}
	},
	/*
	*	Puts the config object into local storage
	*
	*/
	setConfLocal : function(){
		if (!config) return;//Check if there is actually a config

		localStorage.setItem(
			Sha1.hash(config.name,false),
			sjcl.encrypt(config.sha1, JSON.stringify(config))
		);
	}
}
