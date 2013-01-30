var listManager = {
	addFriend : function(){
		var name = document.getElementById('addFriendName').value;
		if (name==null || name=="") {return 1;};
		var key = document.getElementById('addFriendKey').value;

		var friend = {
			"name"	:	name,
			"key"	:	key,
			"address":	Sha1.hash(name, false),
			"lastPos" : null
		};
		config.friendList.push(friend);
		htmlEvents.showFriends();
		configManager.putConfLocal();
		configManager.putConfDHT();
		return;
	},
	removeFriend : function(friend){
		var list = config.friendList;
		var n = list.indexOf(friend);
		if (n == -1){return 1;}
		list = list.splice(0,list.indexOf(friend))
			.concat(list.splice(list.indexOf(friend)+1, list.length));
		config.friendList = list;
		log("Deleted friend "+friend.name+".");
		configManager.putConfLocal();
		configManager.putConfDHT();
		htmlEvents.showFriends();
		return;
	},
	addGroup : function(){
		var name = "blabliblou", passphrase = "All hail Britannia !";
		var key, pubkey, friendList;
		
		name = document.getElementById('addGroupName').value;
		passphrase = document.getElementById('addGroupKey').value;

		
		key = cryptico.generateRSAKey(Sha1.hash(name+passphrase,false),512);
		pubkey = cryptico.publicKeyString(key);

		friendList = [];
		friendList.push(config.friendList[0]);

		var group = {
			name	:	name,
			key	: 	key,
			pubkey	:	pubkey,
			friendList 	:friendList
		}
		
		try{config.groupList.push(group);}catch(err){config.groupList=[];config.groupList.push(group);}
		configManager.putConfLocal();
		configManager.putConfDHT();
		htmlEvents.showGroups();
		return;
	},
	removeGroup : function(g){
		var list = config.groupList;
		console.log("before, g is "+g);
		for (i in list) {
			console.log(list[i]);
		};
		var list2 = list.splice(0,g);
		console.log("first splice, and g is "+g);
		for (i in list2) {
			console.log(list2[i]);
		};
		var list3 = list.splice(g+1, list.length)
		console.log("second splice, and g is "+g);
		for (i in list3) {
			console.log(list3[i]);
		};
		list = list2.concat(list3);
		console.log("after, and g is"+g);
		for (i in list) {
			console.log(list[i]);
		};
		config.groupList = list;
		htmlEvents.showGroups();
		configManager.putConfLocal();
		configManager.putConfDHT();
		return;
	},
	addFriendGroup : function(group, friend){
		var group, friend;

		group = document.getElementById('addGroupName2').value;
		friend = document.getElementById('addGroupUser').value;
		for (g in config.groupList){
			if (config.groupList[g].name == group){
				group = g;
				break;
			}
		}

		for (f in config.friendList){
			if (config.friendList[f].name == friend){
				friend = f;
				break;
			}
		}
		
		config.groupList[group].friendList.push(config.friendList[friend]);
		htmlEvents.showGroups();
		configManager.putConfLocal();
		configManager.putConfDHT();
		return;
	},
	removeFriendGroup : function(g,f){
		console.log("Removing "+config.groupList[g].friendList[f].name+" from group:"+config.groupList[g].name+".");
		var list = config.groupList[g].friendList;
		list = list.splice(0,f)
			.concat(list.splice(f+1, list.length));
		config.groupList[g].friendList = list;
		htmlEvents.showGroups();
		configManager.putConfLocal();
		configManager.putConfDHT();
		return;
	}
};
