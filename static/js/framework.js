/**
* Miscellaneous helpful stuff
*/

var sign = function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

function Create2DArray(rows) {
  var arr = [];
  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }
  return arr;
 }

/**
 * Drawing and color
 */
 
var Picasso = function()
{

}
    Picasso.DrawImageRot = function(ctx, position, image, direction, offset)
    {
        var ox=0, oy=0;
        if (offset==null) {
            ox = ((document.getElementById("canvas").width/2)-240);
            oy = 50;
        }

        direction-=Math.PI/2; //random shit so that they work aith atan2. Make all images point RIGHT
        direction*=-1;

        // save the context
        ctx.save();

        // move the origin
        ctx.translate(position.x+ox, position.y+oy);

        // now move across and down half the
        // width and height of the image
        ctx.translate(image.width/2, image.height/2);

        // rotate around center point
        ctx.rotate(direction);

        // then draw the image back and up
        ctx.drawImage(image, -image.width/2, -image.height/2);

        // and restore the coordinate system
        ctx.restore();

        //...whew... -jnani
    }

    Picasso.DrawBB = function(ctx, bbox, color, offset)
    {
	var ox=0, oy=0;
		if (offset==null) {
			ox = ((document.getElementById("canvas").width/2)-240);
			oy = 50;
		}
		
		
        ctx.fillStyle = color;
        ctx.fillRect(bbox.x + ox, bbox.y + oy, bbox.width, bbox.height);
    }
	
	Picasso.DrawAnimation = function(ctx, anim, bbox, offset) {
		anim.Render(ctx, bbox);
	}
	
var Color = function(r, g, b, a) {
	this.r = r != null ? r : 255;
	this.g = g != null ? g : 255;
	this.b = b != null ? b : 255;
	this.a = a != null ? a : 1;
	
	this.ToStandard = function(noAlpha) {
		if (noAlpha == null || noAlpha)
			return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
		else
			return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	}
	
	this.Blue = new Color(0,0,255,1);
	this.Red = new Color(255,0,0,1);
	this.Green = new Color(0,255,0,1);
	this.Black = new Color(0,0,0,1);
	this.White = new Color(255,255,255,1);
	this.Purple = new Color(255,0,255,1);
}
	
/**
 * VECTOR2
 */
var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;

    /**
     * @return {number}
     */
    this.Direction = function() {
        return Math.atan2(this.x, this.y);
    }

    this.Length = function() {
        return Math.sqrt((this.y * this.y) + (this.x * this.x));
    }
	
	this.Sum = function(v2) {
		return new Vector2(this.x+v2.x, this.y+v2.y);
	}
	
	this.Normalize = function() { //returns 1 length vector in the same direction of this
		var mag = Math.sqrt((this.x*this.x)+(this.y*this.y))
		return new Vector2(this.x/mag, this.y/mag);
	}

	this.MultiplyByScalar = function(sc) {
		this.x*-sc;
		this.y*=sc;
	}

	this.SetDirection = function(angle) {
		var x = this.Length()*Math.cos(angle);
		var y = this.Length()*Math.sin(angle);
		return new Vector2(x,y);
	}
}

/**
 * Bounding Boxes
 */
var Bbox = function(x, y, w, h)
{
    if (x==null || y==null || w==null || y==null)
    {
        alert("rectangle created without required constr vars! (x,y,w,h)")
        var eMsg = "Rectangle created without providing (x,y,w,h)";
        throw new Error(eMsg);
    }
    this.y = y;
    this.width = w;
    this.x = x;
    this.height = h;

    this.Contains = function(x,y)
    {
        return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
    }

    this.Intersects = function(box) {
        var offset = 0;
        if (this.Contains(box.x, box.y))                        return true;
        if (this.Contains(box.x+box.width, box.y))              return true;
        if (this.Contains(box.x+box.width, box.y+box.height))   return true;
        if (this.Contains(box.x, box.y+box.height))             return true;

        if (box.Contains(this.x, this.y))                           return true;
        if (box.Contains(this.x+this.width, this.y))                return true;
        if (box.Contains(this.x+this.width, this.y+this.height))    return true;
        if (box.Contains(this.x, this.y+this.height))               return true;

        return false;
    }
	
	this.Set = function(x,y,w,h) {
		this.x=x;
		this.y=y;
		this.width=w;
		this.height=h;
	}
};

/*
USER INPUT HANDLING
*/

getMousePositionInCanvas = function(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	var mpos = new Vector2(0,0);
	mpos.x = -(canvas.width/2)+Math.floor((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width)+240;
	mpos.y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height) - 50;

	return mpos;
}

var InputHandler = function(canv, player) {
	var dir = 0;
	var listener = new window.keypress.Listener(canv);

	listener.simple_combo("w", function() {
			player.velocity.y = -7;
	});
	
	canv.addEventListener('keydown', function(event) {
		switch (event.keyCode) {
			case 65: player.velocity.x=-4; dir=-1; break;
			case 68: player.velocity.x=4; dir=1; break;
		}
	}, false);
	
	canv.addEventListener('keyup', function(event) {
		switch (event.keyCode) {
			case 65: if (dir==-1) player.velocity.x=0; break;
			case 68: if (dir==1) player.velocity.x=0; break;
		}
	}, false);
	
	canvas.addEventListener('mouseup', function(event) {
		 player.Shoot(getMousePositionInCanvas(canvas, event));
	}, false);

	canvas.addEventListener('mousedown', function(event) {
		player.Draw();
	}, false);
}

/*
	PHYSICS
 */

var physics = function(object, sticky) {
	this.bbox = new Bbox(0,0,0,0);
    this.podIndex = object.podIndex;

	for (var xvel = Math.abs(object.velocity.x); xvel > 0; xvel-=0.5) { //another complicated way to collide more snugly with walls
		this.bbox.Set(object.position.x+(xvel*sign(object.velocity.x)), object.position.y, object.bbox.width, object.bbox.height);
		if (arena.IsHitting(this)) {
			if (sticky)
			{
				object.position.x+=(xvel*sign(object.velocity.x));
				object.velocity.y=object.velocity.x=0;
			}
			continue;
		}
		object.position.x+=(xvel*sign(object.velocity.x));
		break;
	}

	while (Math.abs(object.velocity.y)>1) { //if youre about to hit something below you (or above) keep trying smaller distances. this helps smoothly contact surfaces.
        this.bbox.Set(object.position.x, object.position.y+object.velocity.y, object.bbox.width, object.bbox.height);
		if (arena.IsHitting(this)) {
            if (sticky)
            {
                object.position.y+=(xvel*sign(object.velocity.y));
                object.velocity.y=object.velocity.x=0;
                break;
            }

            object.velocity.y /= 2;
        }
		else {
			object.position.y+=object.velocity.y;
			break;
		}
	}

	if (object.position.y<arena.pods[object.podIndex].height-object.bbox.height) {
		object.velocity.y+=0.5;
	} else {
		object.velocity.y=0;
        if (sticky) object.velocity.x=0;
		object.position.y=arena.pods[object.podIndex].height-object.bbox.height;
	}

    if (object.position.x+object.bbox.width > arena.pods[object.podIndex].width
        && object.podIndex+1 < arena.pods.length)
    {
        object.podIndex+=1;
        object.position.x = 0;
    }

    if (object.position.x < 0
        && object.podIndex-1 >= 0)
    {
        object.podIndex-=1;
        object.position.x = arena.pods[object.podIndex].width-object.bbox.width;
    }
}