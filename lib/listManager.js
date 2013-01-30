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
		log("Deleted friend "+friend.name+".");
		list = list.splice(0,list.indexOf(friend))
			.concat(list.splice(list.indexOf(friend)+1, list.length));
		config.friendList = list;
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

		var group = {
			name	:	name,
			key		: 	key,
			pubkey	:	pubkey,
			friendList 	:friendList
		}
		
		try{config.groupList.push(group);}catch(err){config.groupList=[];config.groupList.push(group);}
		configManager.putConfLocal();
		configManager.putConfDHT();
		htmlEvents.showGroups();
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
		if (typeof group == "undefined"){alert("Group not found, did you spell it right ?");return;}

		for (f in config.friendList){
			if (config.friendList[f].name == friend){
				friend = f;
				break;
			}
		}
		
		config.groupList[group].friendList.push(config.friendList[friend]);
		configManager.putConfLocal();
		configManager.putConfDHT();
		return;
	}
};
