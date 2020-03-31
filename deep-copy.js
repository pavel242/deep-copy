/*
Asynchronous deep-copy procedure for JavaScript 
Based on Worker api
*/

var deepCopy = (function() {
	var blob = new Blob(["self.onmessage = function(e) { self.postMessage(e.data); }"], { type: 'application/javascript;' });
   	var url = URL.createObjectURL(blob);
	var worker = new Worker(url);
	//URL.revokeObjectURL(url); fix for IE

	var count = 0;
	var resolvers = {};

	worker.onmessage = function (event) {
		resolvers[event.data.id](event.data.source);
		delete resolvers[event.data.id];
	};

	function main(data) {
		var id = ++count;

		return new Promise(function(resolve) {
			resolvers[id] = resolve;
			worker.postMessage({source: data, id: id});
		});
	}

	return main;
})();	
