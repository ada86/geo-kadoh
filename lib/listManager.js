var listManager = {};

listManager.showFriends = function(){
	var out = '';
	for (i in config.friendList){
		out += '<li>\
			<i class="icon-user"></i><a href="#" onClick="checkIn.getFriendLocation(config.friendList['+i+']);">\
				'+config.friendList[i].name+'\
				</a>\
				---caca\
			</li>';
	}
	out += '<li><a href="#" role="button" data-toggle="modal" onClick="configManager.addFriendGUI()"><i class="icon-pencil"></i> Edit</a></li>\n'
	document.getElementById('friendMenu').innerHTML = out;
};
