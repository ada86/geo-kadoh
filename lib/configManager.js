var configManager = {
	createConfig : function(username, password){
		config = {};
		config.name = username;
		config.key = Sha1.hash(username+password,false);//TODO:Cryptico
	},
	/*
	*	Will attempt to recover the config from those sources : 
	*	localStorage, DHT
	*/
	logIn : function(username, password){
		//Check if username matches the last used
		var tmpConf = JSON.parse(
			localStorage.getItem("geo-kadoh")
		);
		if (tmpConf == null || tmpConf.name != username){
			tmpConf = JSON.parse(
					localStorage.getItem(
						Sha1.hash(username,false)
					)
				);		
		}
		if (tmpConf != null && tmpConf.name == username){
			if (tmpConf.key == Sha1.hash(username+password,false))
				config = tmpConf;
			else{
				alert("Wrong password, please try again");
				return;
			}
		}else{
			//TODO:Recover from DHT
			if (config == null && confirm("No such user found, do you want to create an account ?")){
				configManager.createConfig(username, password);
			}
			configManager.setConfLocal();//Make sure to copy the configuration on the LocalStorage (maybe ask for user's permission?)
		}
		log("Hello, "+config.name);
		
		localStorage.setItem("geo-kadoh",JSON.stringify(config));
	},
	/*
	*	Puts the config object into local storage
	*
	*/
	setConfLocal : function(){
		localStorage.setItem(
			Sha1.hash(config.name,false),
			JSON.stringify(config)
		);
	}
}
