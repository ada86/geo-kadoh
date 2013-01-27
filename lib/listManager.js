var listManager = {};

listManager.showFriends = function(){
	var out = '';
	for (i in config.friendList){
		out += '<li><a href="#" onClick="checkIn.getFriendLocation(config.friendList['+i+']);"><i class="icon-user"></i>'+config.friendList[i].name+'</a></li>';
	}
	out += '<li><a href="#" role="button" data-toggle="modal" onClick="configManager.addFriendGUI()"><i class="icon-pencil"></i> Edit</a></li>\n'
	document.getElementById('friendMenu').innerHTML = out;
};
