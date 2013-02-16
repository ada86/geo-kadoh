var checkIn = {
	putMyLocation : function(arg){
		//Make sure that the username is defined
		if ((typeof config == "undefined") || config == null || config.name == "anonymous" || config.name == "" || config.name == null){
			alert("Please log in");
			return;
		}
		if(navigator.geolocation) {
			var message = prompt("Do you want to share a message ?");
			navigator.geolocation.getCurrentPosition(function(position){
				if (position == null){
					log("Could not fetch the position !");
				}else{
					position.message = (("" == message) || (null == message) ? undefined : message);
					showPosition(position.coords,false,'You');
					checkIn.putLocationDHT(position, arg);
				}
			}, showGeoError, {enableHighAccuracy:true, timeout:120000}
			);
		}
		else{log("Geolocation not supported in your brower");}
	},

	putLocationDHT : function(position, arg){
		/**
		*	Store the location on the DHT according to the settings in the me object
		**/
		if (position == null || config == null){alert("Something went wrong.");return null;}

		var lifetime = new Date((new Date()).getTime()+604800000);//One week lifetime
			//TODO:Select optimal parameter, maybe in config ?
		var encrypted, address, encPos;
		address = config.name;
		switch (typeof arg){
			case "undefined":
				encrypted = false;
				arg = undefined;
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
		console.log("Attempting to store the location"+ (encrypted?"securely":"publicly"));
		encPos = posUtils.serializePos(
			position,
			encrypted,
			arg
		);
		
		node.put(Sha1.hash(address,false), encPos, lifetime, function(value, peers){
			if (peers == null || peers.size() == 0){
				console.log("The put failed");
				log("Failed to store your position on the DHT");
				alert("Failed to store your position on the DHT !");
			}else{
				var tmp = (encrypted?"friends":"the public");
				if (typeof arg == "object"){tmp = "group "+arg.name;};
				console.log("Location stored succesfully on "+peers.size()+" nodes at '"+Sha1.hash(address,false)+"'");
				console.log(peers);
				log("Location shared successfuly to "+tmp);
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
						var d = new Date(pos.timestamp);
						if (pos != null){
							friend.lastPos = pos;
							log(""+friend.name+" ("+group.name+") is at :\n<a href='http://maps.google.com/maps?z=18&q="+pos.coords.latitude+","+pos.coords.longitude+"' target='_blank'>"+pos.coords.latitude.toString().substring(0,6)+", "+pos.coords.longitude.toString().substring(0,6)+"</a>\n("+d.toUTCString()+")");
							showPosition(pos.coords,true,friend.name+(
								typeof pos.message == "undefined" ?
								" (no message)" : " : "+pos.message));
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

