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
		document.getElementById('loggedInMobile').innerHTML='Logged in as '+config.name+'<br><button href"#outputMobile" class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button>';
		document.getElementById('info').innerHTML='<li><button class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button></li>';
		document.getElementById('welcome').innerHTML='<br><br>';
		document.getElementById('welcomeMobile').innerHTML='';
		htmlEvents.showFriends();
		htmlEvents.showGroups();
	},
	showGroups : function(){
		var putString = '', getLocString='', modalMenuString='', modalContentString='';

		putString += '<li class="text-info">Only to group:</li>';

		for (i in config.groupList){
			modalContentString += '<div class="tab-pane active" id="'+config.groupList[i].name+'">';
			for (j in config.groupList[i].friendList[j]) {
				modalContentString += '<li><p><i class="icon-user"></i>'+config.groupList[i].friendList[j].name+'<button class="btn btn-link" onClick="listManager.removeFriendGroup("'+config.groupList[i].name+'","'+config.groupList[i].friendList[j].name+'");"><i class="icon-trash"></i></button></p></li>'
			}
			modalContentString += '</div>'
			madalMenuString += '<li><a href="#'+config.groupList[i].name+'" data-toggle="tab">'+config.groupList[i].name+'</a><button class="btn btn-link" onClick="listManager.removeGroup("'+config.groupList[i].name+'");"><i class="icon-trash"></i></button></li>'
			putString += '<li><a onClick="checkIn.putGroupLocation(config.groupList['+i+']);"><i class="icon-th-list"></i> '+config.groupList[i].name+' </a></li>';
			getLocString += '<li><a onClick="checkIn.getGroupLocation(config.groupList['+i+']);"><i class="icon-th-list"></i> '+config.groupList[i].name+'</a></li>';
		}
		putString += '<li><a href="#editGroups" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';
		getLocString += '<li><a href="#editGroups" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';

		document.getElementById('shareToGroup').innerHTML = putString;
		document.getElementById('shareToGroupMobile').innerHTML = putString;
		document.getElementById('groupList').innerHTML = getLocString;
		document.getElementById('groupListMobile').innerHTML = getLocString;
		document.getElementById('groupEditList').innerHTML = modalMenuString;
		document.getElementById('groupEditContentList').innerHTML = modalContentString;

	}
};
