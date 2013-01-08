/**
*	Config object that is backed up on Local Storage and the DHT by configManager
*
*	config.groups = list of groups
*			.
*/
var config = {
	name : "anonymous",
	key : null,
	pubkey : "",
	sha1 : "",
	groups : {
		name : "",
		friends : {
		},
		key : ""
	}
}
