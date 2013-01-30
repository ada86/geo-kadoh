var posUtils = {
	decryptPos : function(val, friend, group){
		var rsaEnc, prKey;
		var fName;
		if (typeof group == "object"){
			prKey = group.key;
			fName = friend.name+" ("+group.name+")";
		}else{
			prKey = globalPrKey;
			fName = friend.name;
		}

		try{
			rsaEnc = sjcl.decrypt(friend.key,JSON.stringify(val));
		}catch(err){console.log("error sjcl "+fName+" : "+err);return null;}
		try{
			rsaEnc = cryptico.decrypt(rsaEnc, prKey);
		}catch(err){
			console.log("error decrypting "+fName+" : "+err);
			return null;
		}

		if (rsaEnc.publicKeyString != friend.key){
			log("Possible attempt of spoofing, stay on your guards !");
		}
		console.log("Decrypted "+fName+" : "+rsaEnc.plaintext);
		return JSON.parse(rsaEnc.plaintext);
	},

	serializePos : function(position, encrypted, group){
		/**
		*	This function transforms a position object to a String, that can be deserialized back to an object similar to the original one.
		**/
		var pubkey;
		if (typeof group == "undefined")
			pubkey = globalPuKey;
		else
			pubkey = group.pubkey;

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
					pubkey,
					config.key
				).cipher
			);
			return encPos;
		}
	},
	handleFriendLocation : function(value, friend){
		if (value != null){
			console.log("We got from the DHT : ");
			console.log(JSON.parse(value));
			var position = null;
			try{
				var value = JSON.parse(value);
				if (value.cipher == "aes")
					position = posUtils.decryptPos(value,friend);
				else
					position = value;
			}catch(err){
				console.log("Error decrypting position : "+err+"\n"+"pos = "+position);
			}
			if (position != null){
				log(position.username + " is at : " + position.coords.latitude + ", " + position.coords.longitude);
				showPosition(position.coords);
				return;
			}
			console.log("Position was not readable.");
			log(friend.name+"'s location could not be decrypted.");
		}else{
			log(friend.name+"'s location was not found on the DHT.");
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
	mapholderMobile.style.height='150px'
	var myOptions={
	  center:latlon,zoom:14,
	  mapTypeId:google.maps.MapTypeId.ROADMAP,
	  mapTypeControl:false,
	  disableDefaultUI: true,
	  navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
	};
	var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
	var mapMobile=new google.maps.Map(document.getElementById("mapholderMobile"),myOptions);
	setMarker(map,latlon);
	setMarker(mapMobile,latlon);
}

function setMarker(map,pos){
	var marker=new google.maps.Marker({position:pos,map:map,title:"You are here!"});
}

