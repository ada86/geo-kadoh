var kadohConfig = {
	bootstraps: ["127.0.0.1:3000", "127.0.0.1:3001", "127.0.0.1:3002"],
	reactor: {
		protocol: 'jsonrpc2',
		type: 'SimUDP',
		transport: {
		transports: ['xhr-polling']
			}
		}
	};
var node = new KadOH.Node(undefined, kadohConfig);
node.connect(function() {
console.log('connected');
node.join(function() {
	console.log('joined');
	var peers = node._routingTable.howManyPeers();
	console.log('We got '+peers+' peers in routing table');
	log("Connection to the DHT succesful");
	});
});
window.setTimeout(function(){
	if(node._routingTable.howManyPeers() == 0){
		alert("Connection to the DHT seems to have failed, please reload the page");
	}
}, 7000);

//override node.put to return peer array instead of peer size
node.put = function(key, value, exp, callback, context) {
	context = context || this;

	node.iterativeStore(key, value, exp)
	.then(
		function(key, peers) {
			if (callback) callback.call(context, key, peers);
		}, function() {
			if (callback) callback.call(context, null, null);
		}
	);
	return this;
}

var deleteValue = function(addr){//Doesn't work, repeated calls always do the same thing
	node.iterativeFindValue(addr).then(
		function(a,b){
			var peer = b.array[0];
			console.log("Will attempt to remove "+a.value+" from peer "+peer);
			new node._reactor.RPCObject.STORE(peer, addr, "I don't have long to live", (new Date()).getTime() + 10*1000)
				.then(function(){console.log(this);console.log(arguments);},function(){console.log(arguments);})
				.sendQuery()
		},function(a,b){
			console.log("Something is not quite right...");
			console.log(arguments);
		}
	)
};
