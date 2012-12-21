/**
*	Config object that is backed up on Local Storage and the DHT by configManager
*
*	config.groups = list of groups
*			.
*/
var config = {
	name : "anonymous",
	privatekey : null,
	groups : {
		name : "",
		friends : {
		},
		key : ""
	}
}
