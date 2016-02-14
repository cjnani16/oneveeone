/**
* Miscellaneous helpful stuff
*/

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
var Animation = function(src, xframes, yframes, fwidth, fheight) {
	this.sheet = new Image(src);
	this.width = sheet.width;
	this.height = sheet.height;
	this.xframes = xframes;
	this.yframes = yframes;
	this.fwidth = fwidth;
	this.fheight = fheight;
}
 
var Picasso = function()
{

}
    Picasso.DrawBB = function(ctx, bbox, color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(bbox.x, bbox.y, bbox.width, bbox.height);
    }
	
	Picasso.DrawAnimation = function(anim, pos) {
		ctx.drawImage(0,0, anim.fwidth, anim.fheight, pos.x, pos.y, anim.width, anim.height);
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

    this.Direction = function() {
        return Math.atan(this.y/this.x);
    }

    this.Length = function() {
        return Math.sqrt((this.y * this.y) + (this.x * this.x));
    }
	
	this.Sum = function(v2) {
		return new Vector2(this.x+v2.x, this.y+v2.y);
	}
	
	this.Normalize = function() { //returns 1 length vector in the same direction of this
		var mag = math.sqrt((this.x*this.x)+(this.y*this.y))
		return new Vector2(this.x/mag, this.y/mag);
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
	
	listener.is
}