var port = 420;

var express = require('express');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static(__dirname + "/static"));

//routes
app.get('/', function(req, res) {
	res.sendFile("index.html");
});

//players
var savedpos_x=0, savedpos_y=0;
var posToSend = {
	x: savedpos_x,
	y: savedpos_y
};


var server = http.listen(port, function() {
	console.log("Server started on port " + port + ", blaze it m8.");
});

io.on('connection', function(socket) {
	console.log('User connected');

	io.emit('PositionBroadcast', posToSend);

	socket.on('PositionUpdate', function(ipos) {
		{savedpos_x = ipos.x, savedpos_y = ipos.y} //get pos from client
		{posToSend.y = savedpos_y, posToSend.x = savedpos_x} //send pos to clients
		io.emit('PositionBroadcast', posToSend);
	});
});