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
		friendList.push(config.friendList[0]);

		
		var group = {
			name	:	name,
			key		: 	key,
			pubkey	:	pubkey,
			friendList 	:friendList
		}
		
		config.groupList.push(group);
		htmlEvents.showGroups();
	}
};
