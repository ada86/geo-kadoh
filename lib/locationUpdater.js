var locationUpdater = {
	getFriendLocation : function(friend){
		/**
		*	When called, looks for the value stored at SHA1(friend.name)
		*	which is then printed using log()
		**/
		console.log("Looking for friend : "+friend.name+", address : '"+Sha1.hash(friend.name, false)+"'");
		node.get(Sha1.hash(friend.name, false),
			function (value){
				if (value != null){
					var position = JSON.parse(value);
					log(position.username + " is at : " + position.coords.latitude + ", " + position.coords.longitude);
				}else{
					log(friend.name+"'s location was not found on the DHT");
				}
			}
		);
	}
}
