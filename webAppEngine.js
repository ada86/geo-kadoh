var getKey = function(){
    node.get('1111111111111111111111111111111111111110',
        function (value){
            var output="Couldn't fetch it :'(";
            if (value != null) {output=value;}
                ///Let's print the result
            document.getElementById("output").innerHTML=output;
        }                
    );
};

var giveLocation = function() {
    console.log("GEOLOCATING!");
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
                document.getElementById("output").innerHTML=position.coords.latitude;
                node.put("1111111111111111111111111111111111111110", position.coords, -1, function (key, size){
                        alert("The key is : " + String(key));
                    });
            }, function(error){
                console.log(error);
            }
        );
    }
    else {console.log("NO GEOLOCATION")};
    
};
function getnaddLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(shownputPosition, showError);
    }
    else
        document.getElementById("output").innerHTML="Geolocation not supported in your Browers";
}

function shownputPosition(position) {
    var lat =position.coords.latitude;
    var lon =position.coords.longitude;
    var myName = document.getElementById("myName").value;
    document.getElementById("output").innerHTML="Getting your location and putting it to the dht...";
    var value = String(myName) + " is located at " + lat + " latitude, " + lon + " longitude";
    alert(value);
    node.put(Sha1.hash(myName,false), value, -1, function(value, size){alert("Location added succesfully at '"+Sha1.hash(myName,false)+"'")});
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
        case error.UKNOWN_ERROR:
            document.getElementById("output").innerHTML="An unknown error has occured."
            break;
    }
}

function getFriendLocation(){
    var friend = document.getElementById("friendName").value;
    alert("friend : "+friend+", Sha1 : "+Sha1.hash(friend, false));
    node.get(Sha1.hash(friend, false),
        function (value){
            alert(value);
        }                
    );
}

var sayHi = function(b){
    var key=null;
    var value="Hello World !";

    if (b){key="1111111111111111111111111111111111111110";}
    else {key=prompt("Please input the value","Goodbye world :(");}

    node.put(key, "Hello World !", -1, function (key, size){
            alert("The key is : " + String(key));
    });
}

var log = function() {
    console.log("IMMALIVE");
    //node.put("1111111111111111111111111111111111111110", "Hello World !");
}
