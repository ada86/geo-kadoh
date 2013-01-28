var listManager = {};

listManager.showFriends = function(){
	var out = '';
	var out2 = '';
	
	for (i in config.friendList){
	out += '<li><a onClick="checkIn.getFriendLocation(config.friendList['+i+']);"><i class="icon-user"></i>'+config.friendList[i].name+'</a></li>';
	}
	out += '<li><a href="#editFriends"role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';	
	document.getElementById('friendMenu').innerHTML = out;
	
	for (j in config.friendList){
	out2 += '<li><p><i class="icon-user"></i>'+config.friendList[j].name+' <button class="btn" onClick="configManager.removeFriend(config.friendList['+j+']);"><i class="icon-trash"></i></button></p></li>';
	}
	document.getElementById('friendMenu2').innerHTML = out2;
};
