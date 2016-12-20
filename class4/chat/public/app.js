console.log("app init...");

var lastId = null;
var socket = io({
	'reconnect': function () {
		console.log("reconnected");
		socket.emit("getLost", lastId);
	}
});

function addMsg(msg) {
	$("#messagesPanel").append("<li><span>" + msg.added + "</span>: " + msg.msg + "</li>");
}

socket.on('msg', function (data) {
	let msg = data;
	lastId = data._id;
	addMsg(msg);
});


function send(msg) {
	socket.emit("msg", msg);
}

