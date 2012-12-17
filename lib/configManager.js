var configManager = {
	restoreConf : function(){
		if (config != null){
			log("User = "+config.me);
		}
		//TODO:restore the conf from the local storage, and if not present from the DHT at SHA1(prompt("username+password"))
	}, backupConf : function(){
		//TODO
	}
}
