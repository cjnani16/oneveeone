/**
 * Created by crawf_000 on 1/26/2016.
 */
var canvas          = document.getElementById("canvas");
canvas.width        = 1000;
canvas.height       = 600;
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";
canvas.style.border = "5px solid black";

var ctx             = canvas.getContext('2d');

var arena = new Arena();
var inputh = new InputHandler(canvas, arena.mainPlayer);

var origin_x = (canvas.width/2)-250;

physics = function(object) {
    object.position.x+=object.velocity.x;
    object.position.y+=object.velocity.y;

    if (object.position.y<arena.pods[arena.podIndex].height-object.bbox.height) {
        object.velocity.y+=0.5;
    } else {
        object.velocity.y=0;
        object.position.y=arena.pods[arena.podIndex].height-object.bbox.height;
    }
}

gameLoop = function()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    this.arena.Step();
    Picasso.DrawBB(ctx, arena.pods[arena.podIndex].bg, "gray");
    ctx.fillText(arena.pods[arena.podIndex].name,550,40);

    Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "blue");
	physics(arena.mainPlayer);
	
	window.requestAnimationFrame(gameLoop);
}

gameLoop();