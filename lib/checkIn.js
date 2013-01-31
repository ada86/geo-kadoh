var checkIn = {
	putMyLocation : function(arg){
		//Make sure that the username is defined
		if ((typeof config == "undefined") || config == null || config.name == "anonymous" || config.name == "" || config.name == null){
			alert("Please log in");
			return;
		}
		console.log("putMyLocation("+arg+")");
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				if (position == null){
					log("Could not fetch the position !");
				}else{
					showPosition(position.coords,false);					
					checkIn.putLocationDHT(position, arg);
				}
			}, showGeoError
			);
		}
		else{log("Geolocation not supported in your brower");}
	},

	putLocationDHT : function(position, arg){
		/**
		*	Store the location on the DHT according to the settings in the me object
		**/
		if (position == null || config == null){alert("WTF man ?");return null;}

		var lifetime = -1;//TODO:Select optimal parameter, maybe in config ?
		var encrypted, address, encPos;
		console.log("putLocationDHT : "+arg+"\n "+position);
		address = config.name;
		switch (typeof arg){
			case "undefined":
				encrypted = false;
				break;
			case "boolean":
				encrypted = arg;
				if (encrypted)
					address = config.name+config.pubkey;
				arg = undefined;
				break;
			case "object":
				encrypted = true;
				address = config.name+arg.pubkey;
				break;
			default:
				encrypted = false;
				console.log("putMyLocationDHT : "+arg);
				arg = undefined;
				break;
		}
		encPos = posUtils.serializePos(
			position,
			encrypted,
			arg
		);
		console.log(encPos);
		
		node.put(Sha1.hash(address,false), encPos, lifetime, function(value, size){
			if (size == 0){value
				console.log("The put failed");
				log("Failed to store your position on the DHT");
			}else{
				console.log("Location stored succesfully on "+size+" nodes at '"+Sha1.hash(address,false)+"'");
				log("Location added succesfully at '"+Sha1.hash(address,false)+"'");
			}
		});
	},

	getFriendLocation : function(friend,src){
		/**
		*	When called, looks for the value stored at SHA1(friend's name)
		*	which is then printed using log()
		**/
		if (typeof friend == "undefined"){
			if (src=='desktop') {
				var friend = {
				name : document.getElementById('find').value,
				key : ""
				};
			}
			if (src=='mobile') {
				var friend = {
				name : document.getElementById('findMobile').value,
				key : ""
				};
			}
			if (friend.name == ""){return 1;}
		}

		console.log("Looking for friend : "+friend.name+", address : '"+Sha1.hash(friend.name+friend.key, false)+"'");
		node.get(Sha1.hash(friend.name+friend.key, false), function(value){
			if (value != null){
				posUtils.handleFriendLocation(value, friend);
				return;
			}else{
				console.log("Looking for public location (fallback) : "+Sha1.hash(friend.name,false));
				node.get(Sha1.hash(friend.name, false), function(value){
					posUtils.handleFriendLocation(value, friend);
				});
			}
		});
	},
	getGroupLocation : function(group){
		console.log("getGroupLocation("+group+")");

		if (typeof group == "undefined"){return 1;}

		if (globalMap != null || globalMapMobile != null) {
			initializeMap();
		}

		group.friendList.forEach(function(friend){
			console.log("Attempting to get "+friend.name+"'s location");
			node.get(
				Sha1.hash(friend.name + group.pubkey, false),
				function(value){
					if (value != null){
						var pos = posUtils.decryptPos(JSON.parse(value), friend,group);
						if (pos != null){
							log("<a href='http://maps.google.com/maps?z=18&q="+pos.coords.latitude+","+pos.coords.longitude+"' target='_blank'>"+friend.name+" ("+group.name+") is at :\n"+pos.coords.latitude+", "+pos.coords.longitude+"</a>");
							showPosition(pos.coords,true);
						}else{
							log("Couldn't decrypt the position of "+friend.name+" ("+group.name+").");
						}
					}else{
						log("Could not find location of "+friend.name+" ("+group.name+").");
					}
				}
			);
		});
	}
}

