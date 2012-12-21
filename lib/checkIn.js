var checkIn = {
	putMyLocation : function(){
		//Make sure that the username is defined
		if (config.name === "anonymous" || config.name === "" || config.name === null){
			alert("Please log in");
			return;
		}
			
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
					if (position == null){
						log("Could not fetch the position !");
					}else{
						locationUpdater.putLocation(position);
					}
				}, showGeoError
			);
		}
		else{log("Geolocation not supported in your brower");}
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
