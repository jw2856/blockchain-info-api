	
var request 	= require('request'),
	querystring = require('querystring'),
	baseUrl 	= 'http://blockchain.info/';

var BlockchainInfo = function() {
	this.url = baseUrl;
};

var makeRequest = function(baseUrl, method, params, parserLambda, callback) {
 	var queryString = querystring.stringify(params),
		url = baseUrl + method;

	if (queryString) {
		url += "?" + queryString;
	}

	// Debugging: print out URL;
	console.log("URL: " + url);

	request(url, function(err, response, body) {
		if(err || response.statusCode !== 200) {
			return callback(new Error(err ? err : response.statusCode));
		}

		if(!body) {
			return callback(new Error('Blockchain.info responded without any data'));
		}

		var result;
		try {
			result = parserLambda(body);
		} catch(error) {
			return callback(new Error(error));
		}
		callback(null, result);
	});
};

// index can be a block index or a block hash
BlockchainInfo.prototype.getRawBlock = function(block, callback) {
	makeRequest(this.url, 'rawblock/'+block, {}, JSON.parse, callback);
}

BlockchainInfo.prototype.getSingleTransaction = function(trans, callback) {
	makeRequest(this.url, 'rawtx/'+trans, {}, JSON.parse, callback);
}

BlockchainInfo.prototype.chartData = function(chartType, callback) {
	makeRequest(this.url, 'charts/'+chartType, { "format":"json" }, JSON.parse, callback );
}

BlockchainInfo.prototype.blockHeight = function(blockHeight, callback) {
	makeRequest(this.url, 'block-height/'+blockHeight, { "format":"json" }, JSON.parse, callback);
}

BlockchainInfo.prototype.address = function(address, limit, callback) {}

// addresses is an array of addresses
BlockchainInfo.prototype.addresses = function(addresses, callback){}

// addresses is an array of addresses
BlockchainInfo.prototype.unspent = function(addresses, callback) {}

BlockchainInfo.prototype.latestBlock = function(callback) {}

BlockchainInfo.prototype.unconfirmed = function(callback) {
	makeRequest(this.url, 'unconfirmed-transactions', { "format":"json" }, JSON.parse, callback);
}

BlockchainInfo.prototype.blocks = function(time, poolname, callback) {}

BlockchainInfo.prototype.inventory = function(hash, callback) {}

module.exports = BlockchainInfo;