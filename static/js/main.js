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

socket.on("RecvID", function(id) {
	arena.mainPlayer.id = id;
	gotid=true;
	console.log("got my match id! it's "+id);
});

socket.on("Alert", function(msg) {
	alert(msg);
});

socket.on("ServerBroadcast", function(players) {
	arena.GetPlayerBy
});

var name = document.getElementById("u").innerHTML;

socket.emit("JoinRequest", name);
console.log("user is "+ name);

var Render = function() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	this.arena.Render(ctx);
	this.arena.mainPlayer.Render(ctx);
}


gameLoop = function()
{
	if (!gotid) window.requestAnimationFrame(gameLoop); //dont start playing until we get the id back

	physics(arena.mainPlayer, false);

	arena.Step();

	Render();

	window.requestAnimationFrame(gameLoop);
}

gameLoop();