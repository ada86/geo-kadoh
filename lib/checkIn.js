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
	getFriendLocation : function(){
		/**
		*	When called, looks for the value stored at SHA1(friend's name)
		*	which is then printed using log()
		**/
		var friend = document.getElementById('friendName').value;
		console.log("Looking for friend : "+friend+", address : '"+Sha1.hash(friend, false)+"'");
		node.get(Sha1.hash(friend, false),
			function (value){
				if (value != null){
					var position = JSON.parse(value);
					log(position.username + " is at : " + position.coords.latitude + ", " + position.coords.longitude);
					checkIn.showPosition(position.coords);
				}else{
					log(friend+"'s location was not found on the DHT");
				}
			}
		);
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
		var value = checkIn.serializePos(position, config.name);
		//Make sure the username field of the position is set
		
		log("Attempting to store your position on the DHT...");

		node.put(Sha1.hash(config.name,false), value, lifetime, function(value, size){
			if (size == 0){
				alert("The put failed !!");
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
	}
}
