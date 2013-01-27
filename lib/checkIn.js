var checkIn = {
	putMyLocation : function(){
		//Make sure that the username is defined
		if (config == null || config.name == "anonymous" || config.name == "" || config.name == null){
			alert("Please log in");
			return;
		}
			
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				if (position == null){
					log("Could not fetch the position !");
				}else{
					checkIn.showPosition(position.coords);					
					checkIn.putLocationDHT(position);
				}
			}, showGeoError
			);
		}
		else{log("Geolocation not supported in your brower");}
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
					try{
						var position = JSON.parse(value);
					}catch(err){
						var lolo = {
							name : "lolo",
							key : "rk/qpY3i6AM3+7cv/cGl6srrlnNcWMTFOnZv5qe33ZGVtxq8pazwB6uBTnp8sSm4Bxd2pHLM21ICrnv+KZ2TKQ==",
							lastPos : null
						};
						position = checkIn.decryptPos(value, lolo);
					}
					console.log(position);
					if (position != null)
						log(position.username + " is at : " + position.coords.latitude + ", " + position.coords.longitude);
					if (position != null)//wut ?
						checkIn.showPosition(position.coords);
					if (position != null)
						return;

					try{friend.lastPos = position;}catch(err){console.log(err);}
				}else{
					log(friend.name+"'s location was not found on the DHT");
				}
			}
		);
	},
	decryptPos : function(val, friend){
		var rsaEnc;
		try{
			rsaEnc = cryptico.decrypt(
				sjcl.decrypt(
					friend.key,
					val
				),
				globalPrKey
			);
		}catch(err){
			console.log("error decrypting : "+err);
			return null;
		}
		if (rsaEnc.publicKeyString != friend.key){
			log("Possible attempt of spoofing, stay on your guards !");
		}
		console.log("Decrypted : "+rsaEnc.plaintext);
		return JSON.parse(rsaEnc.plaintext);
	},
	showPosition : function(coords){
		latlon=new google.maps.LatLng(coords.latitude, coords.longitude);
		var mapholder=document.getElementById('mapholder');
		mapholder.style.height='300px';
		var myOptions={
		  center:latlon,zoom:14,
		  mapTypeId:google.maps.MapTypeId.ROADMAP,
		  mapTypeControl:true,
		  navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
		};
		var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
		var marker=new google.maps.Marker({position:latlon,map:map,title:"You are here!"});

	},
	putLocationDHT : function(position){
		/**
		*	Store the location on the DHT according to the settings in the me object
		**/
		if (position == null || config == null){alert("WTF man ?");return null;}

		var lifetime = -1;//TODO:Select optimal parameter, maybe in config ?
		var encPos;
		if (document.getElementById('friendName').value == "encrypted"){
			encPos = sjcl.encrypt(
				config.pubkey,
				cryptico.encrypt(
					checkIn.serializePos(position, config.name),
					globalPuKey,
					config.key
				).cipher
			)
		}else{
			encPos = checkIn.serializePos(position, config.name);
		}
		console.log(encPos);
		node.put(Sha1.hash(config.name,false), encPos, lifetime, function(value, size){
			if (size == 0){
				console.log("The put failed");
				log("Failed to store your position on the DHT");
			}else{
				console.log("Location stored succesfully on "+size+" nodes at '"+Sha1.hash(config.name,false)+"'");
				log("Location added succesfully at '"+Sha1.hash(config.name,false)+"'");
			}
		});
	},
	
	serializePos : function(position, name){
		/**
		*	This function transforms a position object to a String, that can be deserialized back to an object similar to the original one.
		**/
		var objx = {username:name,
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

function showGeoError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			log("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			log("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			log("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			log("An unknown error has occured.");
			break;
		default :
			log(error);
			break;
	}
}
