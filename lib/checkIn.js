var checkIn = {
	putMyLocation : function(encrypted){
		//Make sure that the username is defined
		if (config == null || config.name == "anonymous" || config.name == "" || config.name == null){
			alert("Please log in");
			return;
		}
		
		if(navigator.geolocation) {
			if (encrypted){
				navigator.geolocation.getCurrentPosition(function(position){
					if (position == null){
						log("Could not fetch the position !");
					}else{
						showPosition(position.coords);					
						checkIn.putLocationDHT(position, true);
					}
				}, showGeoError
				);
			}else{
				navigator.geolocation.getCurrentPosition(function(position){
					if (position == null){
						log("Could not fetch the position !");
					}else{
						showPosition(position.coords);					
						checkIn.putLocationDHT(position, false);
					}
				}, showGeoError
				);
			}
		}
		else{log("Geolocation not supported in your brower");}
	},

	putLocationDHT : function(position, encrypted){
		/**
		*	Store the location on the DHT according to the settings in the me object
		**/
		if (position == null || config == null){alert("WTF man ?");return null;}

		var lifetime = -1;//TODO:Select optimal parameter, maybe in config ?
		var encPos;
		encPos = checkIn.serializePos(
			position,
			encrypted
		);
		console.log(encPos);
		node.put(Sha1.hash(config.name,false), encPos, lifetime, function(value, size){
			if (size == 0){value
				console.log("The put failed");
				log("Failed to store your position on the DHT");
			}else{
				console.log("Location stored succesfully on "+size+" nodes at '"+Sha1.hash(config.name,false)+"'");
				log("Location added succesfully at '"+Sha1.hash(config.name,false)+"'");
			}
		});
	},

	getFriendLocation : function(friend){
		/**
		*	When called, looks for the value stored at SHA1(friend's name)
		*	which is then printed using log()
		**/
		if (!friend){
			var friend = {
				name : document.getElementById('friendName').value,
				key : null
			};
			if (friend.name == ""){return 1;}
		}
		console.log("Looking for friend : "+friend.name+", address : '"+Sha1.hash(friend.name, false)+"'");
		node.get(Sha1.hash(friend.name, false),
			function (value){
				if (value != null){
					console.log("We got from the DHT : ");
					console.log(value);
					var position = null;
					try{
						var value = JSON.parse(value);
						if (value.cipher == "aes")
							position = posUtils.decryptPos(value,friend);
						else
							position = value;
					}catch(err){
						console.log("Error reading position : "+err+"\n"+"pos = "+position);
					}
					if (position != null){
						log(position.username + " is at : " + position.coords.latitude + ", " + position.coords.longitude);
						showPosition(position.coords);
						return;
					}
					console.log("Position was not readable.");
					log(friend.name+"'s location was not found on the DHT.");
				}else{
					log(friend.name+"'s location was not found on the DHT");
				}
			}
		);
	}
}

