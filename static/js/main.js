/**
 * Created by crawf_000 on 1/26/2016.
 */
var canvas          = document.getElementById("canvas");
canvas.width        = 1000;
canvas.height       = 600;
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var ctx             = canvas.getContext('2d');

var arena = new Arena();
var inputh = new InputHandler(canvas, arena.mainPlayer);

var origin_x = (canvas.width/2)-240;

var gotid=false;

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

	console.log("server says: my position is ("+packet.position.x+","+packet.position.y+")");
});

socket.on("TheirState", function(packet) {
	arena.otherPlayer.position = packet.position;
	arena.otherPlayer.velocity = packet.velocity;
	arena.otherPlayer.name = packet.name;
	arena.otherPlayer.podIndex = packet.podIndex;
	console.log("theirstate");
});

socket.on("ArenaState", function(packet) {
	arena.quiver = packet.quiver;
	arena.arrow_count = packet.arrowcount;
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

gameLoop = function()
{
	if (!gotid) return;//window.requestAnimationFrame(gameLoop); //dont start playing until we get the id back

	physics(arena.mainPlayer, false);
	physics(arena.otherPlayer, false);

	arena.Step();

	Render();

	//window.requestAnimationFrame(gameLoop);
}


//ONCE WE JOIN
var name = document.getElementById("u").innerHTML;
socket.emit("JoinRequest", name);
console.log("user is "+ name);
gameLoop();

setInterval(getServerUpdate, 1000/30);
setInterval(gameLoop, 1000/50);