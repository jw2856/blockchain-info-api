#!/usr/local/bin/node

var Blockchain = require('./blockchaininfo');

var bs = new Blockchain();

console.log(bs);

// bs.unconfirmed(function(err, result) {
// 	if(!err) {
// 		console.log(result);
// 	} else {
// 		console.log(err);
// 	}
// });

var block = "00000000000007d0f98d9edca880a6c124e25095712df8952e0439ac7409738a";

bs.getRawBlock(block, function(err, result) {
	if(!err) {
		console.log("done");
	} else {
		console.log(err);
	}
});