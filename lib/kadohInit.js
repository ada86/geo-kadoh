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
var node;
try{
	node = new KadOH.Node(undefined, kadohConfig);
	node.connect(function() {
	console.log('connected');
	node.join(function() {
		console.log('joined');
		var peers = node._routingTable.howManyPeers();
		console.log('We got '+peers+' peers in routing table');
		log("Connection to the DHT succesful");
		});
	});
}
catch(err){
	console.log("Serverside problem with kadoh");
	node = {
		put : function(){
			return -1;
		},
		get : function(){
			return null;
		}
	};
}

var globalPrKey = cryptico.generateRSAKey("geokadoh", 512),
	globalPuKey = cryptico.publicKeyString(globalPrKey);