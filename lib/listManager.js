var listManager = {
	showFriends : function(){
		var out = '';
		var out2 = '';
		
		for (i in config.friendList){
		out += '<li><a onClick="checkIn.getFriendLocation(config.friendList['+i+']);"><i class="icon-user"></i>'+config.friendList[i].name+'</a></li>';
		}
		out += '<li><a href="#editFriends" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';	
		document.getElementById('friendMenu').innerHTML = out;
		
		for (j in config.friendList){
		out2 += '<li><p><i class="icon-user"></i>'+config.friendList[j].name+'<button class="btn btn-link" onClick="listManager.removeFriend(config.friendList['+j+']);"><i class="icon-trash"></i></button></p></li>';
		}
		document.getElementById('friendMenu2').innerHTML = out2;
	},
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
		listManager.showFriends();
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
		listManager.showFriends();
		return;
	}
};
