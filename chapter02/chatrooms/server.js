var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var chatServer = require("./lib/chat_server");

var cache = [];//用来缓存文件内容的对象

var server = http.createServer(function(request, response) {
	var filePath = false;

	if(request.url == "/"){
		filePath = "public/index.html";
	}else{
		filePath = "/public" + request.url;
	}
	var absPath = "./" + filePath;
	sendStatic(response, cache, absPath);
});

chatServer.listen(server);

server.listen(3000, function() {
	console.log("Server listening on port 3000.");
});

/*错误响应*/
function send404(response){
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write("Error 404: resource not found");
	response.end();
}
/*发送文件数据*/
function sendFile (response, filePath, fileContents) {
	response.writeHead(200, 
		{'Content-Type': mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}
/*提供静态文件服务*/
function sendStatic (response, cache, absPath) {
	//检查文件是否缓存在内存中
	if(cache[absPath]){
		//从内存中返回文件
		sendFile(response, absPath, cache[absPath]);
	}else{
		//检查文件是否存在
		fs.exists(absPath, function(exists) {
			if(exists){
				fs.readFile(absPath, function(err, data) {
					if(err){
						send404(response);
					}else{
						cache[absPath] = data;
						//从硬盘中读取文件并返回
						sendFile(response, absPath, data);
					}
				});
			}else{
				//发送http 404响应
				send404(response);
			}
		})
	}
}