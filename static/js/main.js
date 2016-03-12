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

socket.on("PositionBroadcast", function(spos) {
	arena.mainPlayer.position = spos;
});

var Render = function() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	this.arena.Render(ctx);
	this.arena.mainPlayer.Render(ctx);
}

gameLoop = function()
{
	physics(arena.mainPlayer, false);

	arena.Step();

	socket.emit('PositionUpdate', arena.mainPlayer.position);

	Render();

	window.requestAnimationFrame(gameLoop);
}

gameLoop();