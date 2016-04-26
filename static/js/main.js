/**
 * Created by crawf_000 on 1/26/2016.
 */
var canvas          = document.getElementById("canvas");
canvas.width        = 1040;
canvas.height       = 600;
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var ctx             = canvas.getContext('2d');

var arena = new Arena();
var inputh;

var origin_x = (canvas.width/2)-240;

var cam = new GameCamera(arena.mainPlayer.bbox, 960, 600, 300,300);

var gotid=false;
var matchBegun=false;
var serverUpdateInterval, gameLoopInterval, lobbyLoopInterval;

//RECEIVE MESSAGES FROM SERVER
socket.on("RecvID", function(id) {
	arena.mainPlayer.id = id;
	gotid=true;
	console.log("got my match id! it's "+id);
});

socket.on("Alert", function(msg) {
	alert(msg);
});

socket.on("YourState", function(packet) {
	arena.mainPlayer.position = packet.position;
	arena.mainPlayer.velocity = packet.velocity;
	arena.mainPlayer.name = packet.name;
	arena.mainPlayer.podIndex = packet.podIndex;
});

socket.on("TheirState", function(packet) {
	matchBegun = true;
	arena.otherPlayer.position = packet.position;
	arena.otherPlayer.velocity = packet.velocity;
	arena.otherPlayer.name = packet.name;
	arena.otherPlayer.podIndex = packet.podIndex;
});

socket.on("LateJoin", function() {
	matchBegun = true;
	inputh = new InputHandler(canvas, arena.mainPlayer);
});

socket.on("ArenaState", function(packet) {
	arena.quiver = packet.quiver;
	arena.arrow_count = packet.arrowcount;
});

socket.on("MatchEnd", function(result) {
	socket.disconnect();
	clearInterval(serverUpdateInterval);
	clearInterval(gameLoopInterval);

	if (result)
		alert("Victory!");
	else
		alert("Defeat.");
});

var Render = function() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	this.arena.Render(ctx);
	this.arena.mainPlayer.Render(ctx);
	
	if(this.arena.mainPlayer.podIndex == this.arena.otherPlayer.podIndex) {
		this.arena.otherPlayer.Render(ctx);
	}
}

var getServerUpdate = function() {
	socket.emit("MatchStateRequest");
}

lobbyLoop = function() {
	if (!gotid) {
		ctx.clearRect(0,0,canvas.width, canvas.height);
		Picasso.DrawText(ctx, "Connecting to server...", 30, 250, null, {color: "black", size:30, font:"Carter One"});
		return;
	}

	if (!matchBegun) {
		ctx.clearRect(0,0,canvas.width, canvas.height);
		Picasso.DrawText(ctx, "Waiting for opponent...", 30, 250, null, {color: "black", size:30, font:"Carter One"});
		return;
	}

	clearInterval(lobbyLoopInterval);

	if (serverUpdateInterval==null && gameLoopInterval==null) {
		serverUpdateInterval = setInterval(getServerUpdate, 1000/30);
		gameLoopInterval = setInterval(gameLoop, 1000/50);
	}
}

gameLoop = function()
{
	if (!gotid) return;//window.requestAnimationFrame(gameLoop); //dont start playing until we get the id back

	physics(arena.mainPlayer, false);
	physics(arena.otherPlayer, false);

	arena.Step();
	cam.Update();

	Render();

	//window.requestAnimationFrame(gameLoop);
}


//ONCE WE JOIN
var name = document.getElementById("u").innerHTML;
socket.emit("JoinRequest", name);
console.log("user is "+ name);

loppyLoopInterval = setInterval(lobbyLoop, 1000);