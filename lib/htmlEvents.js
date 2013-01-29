var htmlEvents = {
	showFriends : function(){
		var out = '';
		var out2 = '';
		
		for (i in config.friendList){
		out += '<li><a onClick="checkIn.getFriendLocation(config.friendList['+i+']);"><i class="icon-user"></i>'+config.friendList[i].name+'</a></li>';
		}
		out += '<li><a href="#editFriends" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';	
		document.getElementById('friendList').innerHTML = out;
		document.getElementById('friendListMobile').innerHTML = out;
		
		for (j in config.friendList){
		out2 += '<li><p><i class="icon-user"></i>'+config.friendList[j].name+'<button class="btn btn-link" onClick="listManager.removeFriend(config.friendList['+j+']);"><i class="icon-trash"></i></button></p></li>';
		}
		document.getElementById('friendListModal').innerHTML = out2;
	},
	loggedIn : function(){
		document.getElementById('loggedIn').innerHTML="Logged in as "+config.name;
		document.getElementById('loggedInMobile').innerHTML="Logged in as "+config.name;
		document.getElementById('info').innerHTML='<li><button class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button></li>';
		document.getElementById('welcome').innerHTML='<br><br><br>';
		document.getElementById('welcomeMobile').innerHTML='';
		htmlEvents.showFriends();
	},
	showGroups : function(){
		var putString = '', getLocString='';
		//
		//<li align="left"><a onClick="checkIn.putGroupLocation('GroupName');"><i class="icon-th-list"></i> GroupName</a></li>
		//<li><a onClick="checkIn.getGroupLocation('GroupName');"><i class="icon-th-list"></i> GroupName</a></li>

		putString += '<li class="text-info">Only to group:</li>';

		for (i in config.friendList){
			putString += '<li align="left"><a onClick="checkIn.putGroupLocation(config.friendList['+i+']);"><i class="icon-th-list"></i> '+config.friendList[i].name+' </a></li>';
			getLocString += '<li><a onClick="checkIn.getGroupLocation(config.friendList['+i+']);"><i class="icon-th-list"></i> '+config.friendList[i].name+'</a></li>';
		}
		putString += '<a href="#editGroups" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a>';
		getLocString += '<a href="#editGroups" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a>';

		document.getElementById('shareToGroup').innerHTML = putString;
		document.getElementById('shareToGroupMobile').innerHTML = putString;
		document.getElementById('groupList').innerHTML = getLocString;
		document.getElementById('groupListMobile').innerHTML = getLocString;

		//what about the modal??
	}
};
