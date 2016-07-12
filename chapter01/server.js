//server.js
var http = require("http");
var server = http.createServer();

server.on("request", function(req, res){
	res.writeHead(200, {"Contnet-Type": "text/plain"});
	res.end("Hello Server!\n");
});
server.listen(3000);
console.log("Server running at http://localhost:3000/");