	
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

// index can be a block index or a block hash.
BlockchainInfo.prototype.getRawBlock = function(block, callback) {
	makeRequest(this.url, 'rawblock/'+block, {}, JSON.parse, callback);
}

// Hex format output not supported
BlockchainInfo.prototype.getSingleTransaction = function(trans, includeScripts, callback) {
	makeRequest(this.url, 'rawtx/'+trans, includeScripts ? { "scripts":true } : {}, JSON.parse, callback);
}

BlockchainInfo.prototype.chartData = function(chartType, callback) {
	makeRequest(this.url, 'charts/'+chartType, { "format":"json" }, JSON.parse, callback );
}

BlockchainInfo.prototype.blockHeight = function(blockHeight, callback) {
	makeRequest(this.url, 'block-height/'+blockHeight, { "format":"json" }, JSON.parse, callback);
}

BlockchainInfo.prototype.address = function(address, limit, callback) {
	makeRequest(this.url, 'address/'+address, limit ? { "format":"json", "limit":limit } : { "format":"json" }, JSON.parse, callback);
}

// addresses is an array of addresses
BlockchainInfo.prototype.addresses = function(addresses, callback){
	var addressString = addresses.join('|');
	makeRequest(this.url, 'multiaddr', { "active" : addressString }, JSON.parse, callback);
}

// addresses is an array of addresses
BlockchainInfo.prototype.unspent = function(addresses, callback) {
	var addressString = addresses.join('|');
	makeRequest(this.url, 'unspent', { "active" : addressString }, JSON.parse, callback);
}

BlockchainInfo.prototype.latestBlock = function(callback) {
	makeRequest(this.url, 'latestblock', {}, JSON.parse, callback);
}

BlockchainInfo.prototype.unconfirmed = function(callback) {
	makeRequest(this.url, 'unconfirmed-transactions', { "format":"json" }, JSON.parse, callback);
}

BlockchainInfo.prototype.blocks = function(timeOrPool, callback) {
	makeRequest(this.url, 'blocks/'+timeOrPool, { "format":"json" }, JSON.parse, callback);
}

BlockchainInfo.prototype.inventory = function(hash, callback) {
	makeRequest(this.url, 'inv/'+hash, { "format":"json" }, JSON.parse, callback);
}

module.exports = BlockchainInfo;