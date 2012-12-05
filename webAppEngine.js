function getnaddLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(shownputPosition, showError);
	}
	else
		document.getElementById("output").innerHTML="Geolocation not supported in your Browers";
}

function shownputPosition(position) {
	/**
	*  Puts a string containing the location of the user at the address SHA1(value of field myName)
	**/
	var lat =position.coords.latitude;
	var lon =position.coords.longitude;
	var myName = document.getElementById("myName").value;
	log("Getting your location and putting it to the dht...");
	//var value = String(myName) + " is located at " + lat + " latitude, " + lon + " longitude";
	var value = serializePos(position, myName);
	alert(value);
	node.put(Sha1.hash(myName,false), value, -1, function(value, size){
		log("Location added succesfully at '"+Sha1.hash(myName,false)+"'");
	});
	<!-- add here the getting of map -->
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			document.getElementById("output").innerHTML="User denied the request for Geolocation."
			break;
		case error.POSITION_UNAVAILABLE:
			document.getElementById("output").innerHTML="Location information is unavailable."
			break;
		case error.TIMEOUT:
			document.getElementById("output").innerHTML="The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			document.getElementById("output").innerHTML="An unknown error has occured."
			break;
	}
}

function getFriendLocation(){
	/**
	*	When called, looks for the value stored at SHA1(the value of the field "friendName")
	*	which is then printed using log()
	**/
	var friend = document.getElementById("friendName").value;
	log("Looking for friend : "+friend+", Sha1 : "+Sha1.hash(friend, false));
	node.get(Sha1.hash(friend, false),
		function (value){
			log(JSON.parse(value).username);
			//log("String(value) + " is located at " + lat + " latitude, " + lon + " longitude";");
		}				 
	);
}

function log(txt){
	document.getElementById("output").innerHTML=txt;
}



//Test functions

function serializePos(position, usrName){
	var objx = {username:usrName,timestamp:position.timestamp,coords:{latitude:position.coords.latitude,longitude:position.coords.longitude,accuracy:position.coords.accuracy,speed:position.coords.speed}}; 
	return JSON.stringify(objx);
}


function pushJSONedPos(){
		navigator.geolocation.getCurrentPosition(function (position){
				console.log("Result of position : " + (serializePos(position)));
				console.log("Result of stringify : " + JSON.stringify(serializePos(position)));
			},
			showError);
}
