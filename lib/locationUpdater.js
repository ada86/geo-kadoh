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
	},

	putLocation : function(position, me){
		/**
		*	Store the location on the DHT according to the settings in the me object
		*	
		**/
		if (position == null || me == null){alert("WTF man ?");return null;}

		//Make sure the username field of the position is set
		if (position.username == null){
			position.username = me.name;
		}
		
		log("Attempting to store your position on the DHT...");

		var value = locationUpdater.serializePos(position);
		node.put(Sha1.hash(me.name,false), value, -1, function(value, size){
			if (size == 0){
				alert("The put failed !!");
				log("Failed to store your position on the DHT");
			}else{
				console.log("Location stored succesfully on "+size+" nodes at '"+Sha1.hash(me.name,false)+"'");
				log("Location added succesfully at '"+Sha1.hash(me.name,false)+"'");
			}
		});
	},
	
	serializePos : function(position){
		/**
		*	This function transforms a position object to a String, that can be deserialized back to an object similar to the original one.
		**/
		var objx = {username:position.username,
			timestamp:position.timestamp,
			coords:{
				latitude:position.coords.latitude,
				longitude:position.coords.longitude,
				accuracy:position.coords.accuracy,
				speed:position.coords.speed
			}
		}; 
		return JSON.stringify(objx);
	}
}
