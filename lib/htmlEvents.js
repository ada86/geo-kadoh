var htmlEvents = {
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
	loggedIn : function(){
			document.getElementById('loggedin').innerHTML="Logged in as "+config.name;
			document.getElementById('loggedin_phone').innerHTML="Logged in as "+config.name;
			document.getElementById('info').innerHTML='<li><button class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button></li>';
			document.getElementById('hero1').innerHTML='';
			document.getElementById('logo').innerHTML='<img height="133" width="135"src="bootstrap/img/Geo-KadOH_logo.png"><h4>Geo-KadOH</h4>';
			htmlEvents.showFriends();
	}
};