var checkIn = {
	putMyLocation : function(){
		//Make sure that the username is defined
		while (config.me.name === "anonymous" || config.me.name === "" || config.me.name === null){
			config.me.name = prompt("Please enter your name", "anonymous");
		}
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
					if (position == null){
						log("Could not fetch the position !");
					}else{
						locationUpdater.putLocation(position, config.me);
					}
				}, showError
			);
		}
		else{log("Geolocation not supported in your brower");}
	}
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			document.getElementById("output").innerHTML="User denied the request for Geolocation.";
			break;
		case error.POSITION_UNAVAILABLE:
			document.getElementById("output").innerHTML="Location information is unavailable.";
			break;
		case error.TIMEOUT:
			document.getElementById("output").innerHTML="The request to get user location timed out.";
			break;
		case error.UNKNOWN_ERROR:
			document.getElementById("output").innerHTML="An unknown error has occured.";
			break;
	}
}
