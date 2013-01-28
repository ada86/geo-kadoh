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
					showPosition(position.coords);					
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
					console.log("We got from the DHT : ");
					console.log(value);
					var position = null;
					try{
						var value = JSON.parse(value);
						if (value.cipher == "aes")
							position = checkIn.decryptPos(value,friend);
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
				}else{
					log(friend.name+"'s location was not found on the DHT");
				}
			}
		);
	},

	decryptPos : function(val, friend){
		var rsaEnc;
		try{
			rsaEnc = sjcl.decrypt(friend.key,JSON.stringify(val));
		}catch(err){console.log("error sjcl : "+err);return null;}
		try{
			rsaEnc = cryptico.decrypt(rsaEnc, globalPrKey);
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

	putLocationDHT : function(position){
		/**
		*	Store the location on the DHT according to the settings in the me object
		**/
		if (position == null || config == null){alert("WTF man ?");return null;}

		var lifetime = -1;//TODO:Select optimal parameter, maybe in config ?
		var encPos;
		encPos = checkIn.serializePos(
			position,
			(document.getElementById('friendName').value == "encrypted")
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

	decryptPos : function(val, friend){
		var rsaEnc;
		try{
			rsaEnc = sjcl.decrypt(friend.key,JSON.stringify(val));
		}catch(err){console.log("error sjcl : "+err);return null;}
		try{
			rsaEnc = cryptico.decrypt(rsaEnc, globalPrKey);
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

	serializePos : function(position, encrypted){
		/**
		*	This function transforms a position object to a String, that can be deserialized back to an object similar to the original one.
		**/
		var objx = {username:config.name,
			timestamp:position.timestamp,
			coords:{
				latitude:position.coords.latitude,
				longitude:position.coords.longitude,
				accuracy:position.coords.accuracy,
				speed:position.coords.speed
			},
			cipher : null
		}; 
		if (!encrypted){
			return JSON.stringify(objx);
		}else{
			var encPos;
			encPos = sjcl.encrypt(
				config.pubkey,
				cryptico.encrypt(
					JSON.stringify(objx),
					globalPuKey,
					config.key
				).cipher
			);
			return encPos;
		}
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
function showPosition(coords){
	latlon=new google.maps.LatLng(coords.latitude, coords.longitude);
	var mapholder=document.getElementById('mapholder');
	mapholder.style.height='300px';
	var myOptions={
	  center:latlon,zoom:14,
	  mapTypeId:google.maps.MapTypeId.ROADMAP,
	  mapTypeControl:false,
	  disableDefaultUI: true,
	  navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
	};
	var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
	var marker=new google.maps.Marker({position:latlon,map:map,title:"You are here!"});

}

