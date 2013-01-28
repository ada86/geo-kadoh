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
		htmlEvents.showFriends();
		return;
	}
};
