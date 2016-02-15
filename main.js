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

var physics = function(object) {
	var temp = new Bbox(0,0,0,0);
	
	for (var xvel = Math.abs(object.velocity.x); xvel > 0; xvel-=0.5) { //another complicated way to collide more snugly with walls
		temp.Set(object.position.x+(xvel*sign(object.velocity.x)), object.position.y, object.bbox.width, object.bbox.height);
		if (arena.IsHitting(temp))
			continue;
		object.position.x+=(xvel*sign(object.velocity.x));
		break;
	}
	
	while (Math.abs(object.velocity.y)>1) { //if youre about to hit something below you (or above) keep trying smaller distances. this helps smoothly contact surfaces.
		temp.Set(object.position.x, object.position.y+object.velocity.y, object.bbox.width, object.bbox.height);
		if (arena.IsHitting(temp))
			object.velocity.y/=2;
		else {
			object.position.y+=object.velocity.y;
			break;
		}
	}

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
    Picasso.DrawBB(ctx, arena.pods[arena.podIndex].bg, "gray");
	this.arena.Step(ctx,arena.mainPlayer.bbox);
    ctx.fillText(arena.pods[arena.podIndex].name,550,40);
	
	if (arena.IsHitting(arena.mainPlayer.bbox))
    Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "red");
	else Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "blue");
	
	physics(arena.mainPlayer);
	
	window.requestAnimationFrame(gameLoop);
}

gameLoop();