var Chat = function(socket) {
	this.socket = socket;
};

//发送聊天消息
Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	};
	this.socket.emit("message", message);
};
//变更房间
Chat.prototype.changeRoom = function(room) {
	this.socket.emit("join", {
		newRoom: room
	});
};
//处理聊天命令，join用来加入或者创建一个房间，nick用来修改昵称
Chat.prototype.processCommand = function(command) {
	var words = command.split(" ");
	//从第一个单词开始解析命令
	var command = words[0].substring(1, words[0].length).toLowerCase();
	var message = false;

	switch (command) {
		case "join":
			words.shift();
			var room = words.join(" ");
			//处理房间的变换/创建
			this.changeRoom(room);
			break;
		case "nick":
			words.shift();
			var name = words.join(" ");
			//处理更名尝试
			this.socket.emit("nameAttempt", name);
			break;
		default:
			//如果命令无法识别，返回错误消息
			message = "Unrecoginized command.";
			break;
	}
};