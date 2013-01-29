var posUtils = {
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

