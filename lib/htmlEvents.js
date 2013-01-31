var htmlEvents = {
	showFriends : function(){
		var out = '', out2 = '', out3 = '';
		out3 += '<option>Select Friend</option>';
		
		for (i in config.friendList){
			if (i>0) {
				out += '<li><a onClick="checkIn.getFriendLocation(config.friendList['+i+']);"><i class="icon-user"></i>'+config.friendList[i].name+'</a></li>';
			}
		}
		out += '<li><a href="#editFriends" role="button" data-toggle="modal"><i class="icon-pencil"></i> Edit</a></li>';	
		document.getElementById('friendList').innerHTML = out;
		document.getElementById('friendListMobile').innerHTML = out;
		
		for (j in config.friendList){
			if (j>0) {
				out2 += '<li><p><i class="icon-user"></i>'+config.friendList[j].name+'<button class="btn btn-link" onClick="listManager.removeFriend(config.friendList['+j+']);"><i class="icon-trash"></i></button></p></li>';
				out3 += '<option>'+config.friendList[j].name+'</option>';
			}
		}
		document.getElementById('friendListModal').innerHTML = out2;
		document.getElementById('addFriendToGroup_friend').innerHTML = out3;
	},
	loggedIn : function(){
		//Not html, but JSON revivers look so hard :(
		for (g in config.groupList){
			config.groupList[g].key = cryptico.generateRSAKey(config.groupList[g].rsaString,512);
		}

		document.getElementById('loggedIn').innerHTML="Logged in as <a href='#' onClick='log2();'>"+config.name+"</a>";
		document.getElementById('loggedInMobile').innerHTML='Logged in as <a href="#" onClick="log2()">'+config.name+'</a><br><br><button href"#outputMobile" class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button>';
		document.getElementById('info').innerHTML='<li><button class=\'btn btn-success\' onClick=\'log("Your key is : '+config.pubkey+' ")\'> Show my key </button></li>';
		document.getElementById('welcome').innerHTML='<br><br><br>';
		document.getElementById('welcomeMobile').innerHTML='';
		document.getElementById('hideDesktop').className="row-fluid"
		document.getElementById('hideMobile').className="row-fluid"
		htmlEvents.showFriends();
		htmlEvents.showGroups();
	},
	showGroups : function(){
		var putString = '', getLocString='', modalMenuString='', modalContentString='', modalSelectGroup='';

		putString += '<li class="text-info">Only to group:</li>';
		modalSelectGroup += '<option>Select Group</option>';

		for (i in config.groupList){
			if (i==0) {
				modalContentString += '<div class="tab-pane active" id="'+config.groupList[i].name+'">';
				modalMenuString += '<li class="active"><a href="#'+config.groupList[i].name+'" data-toggle="tab">'+config.groupList[i].name+'</a><button class="btn btn-link" onClick="listManager.removeGroup('+i+');"><i class="icon-trash"></i></button></li>';
			} else{
				modalContentString += '<div class="tab-pane" id="'+config.groupList[i].name+'">';
				modalMenuString += '<li><a href="#'+config.groupList[i].name+'" data-toggle="tab">'+config.groupList[i].name+'</a><button class="btn btn-link" onClick="listManager.removeGroup('+i+');"><i class="icon-trash"></i></button></li>';
			}
			for (j in config.groupList[i].friendList) {
				if (typeof config.groupList[i].friendList[j] == "object" && j>0)
					modalContentString += '<li><p><i class="icon-user"></i>'+config.groupList[i].friendList[j].name+'<button class="btn btn-link" onClick="listManager.removeFriendGroup('+i+','+j+');"><i class="icon-trash"></i></button></p></li>';
			}
			modalContentString += '</div>';

			modalSelectGroup += '<option>'+config.groupList[i].name+'</option>';
			putString += '<li><a onClick="checkIn.putMyLocation(config.groupList['+i+']);"><i class="icon-th-list"></i> '+config.groupList[i].name+' </a></li>';
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
		document.getElementById('addFriendToGroup_group').innerHTML = modalSelectGroup;

	}
};
