/*
*
* F R A M E W O R K
*
*/

var sign = function(x) {
 return x > 0 ? 1 : x < 0 ? -1 : 0; 
}

function Create2DArray(rows) 
{
  var arr = [];
  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }
  return arr;

 }

	
/*VECTOR2*/
var Vector2 = function(x, y) 
{
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

/*BBOX*/
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

/*USER INPUT HANDLING*/
getMousePositionInCanvas = function(canvas, event) 
{
	var rect = canvas.getBoundingClientRect();
	var mpos = new Vector2(0,0);
	mpos.x = -(canvas.width/2)+Math.floor((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width)+240;
	mpos.y = Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height) - 50;

	return mpos;
}

var InputHandler = function(canv, player) 
{
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

/*PHYSICS*/
var physics = function(object, sticky, arena) 
{
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

/*
*
* T I L E M A P
*
*/

var TileMap = function(w,h,ta,td) 
{
	this.tilesacross	=ta;
	this.tilesdown		=td;
	this.width			=w;
	this.height			=h;
	this.tilewidth      =w/ta;
	this.tileheight		=h/td;
	
	this.collidingWithPlayer = [false,false];
	
	this.tiles = [];
	
	for (var i=0;i<this.tilesdown;i++)
	{
		this.tiles[i] = [];
		for (var k=0;k<this.tilesacross;k++)
		{
			this.tiles[i][k] = 0;
		}
	}
	
	this.tiles[5][0]=1; //test code for a simple map, TODO read these from files
	this.tiles[5][1]=2;
	this.tiles[5][2]=1;
	this.tiles[5][3]=2;
	this.tiles[4][3]=1;
	this.tiles[5][4]=1;
	this.tiles[5][5]=1;
	this.tiles[5][6]=2;
	this.tiles[5][7]=1;
	this.tiles[5][8]=2;
	this.tiles[5][9]=1;
	this.tiles[6][10]=1;
	this.tiles[7][11]=1;
	this.tiles[8][12]=1;
	this.tiles[9][13]=1;
	this.tiles[9][14]=1;
	this.tiles[9][15]=1;
	this.tiles[9][16]=1;
	this.tiles[9][17]=1;
	
	this.CheckCollision = function(box) {
		var temp = new Bbox(0,0,0,0);
		
		for (var i=0;i<this.tilesdown;i++) 
		{
			for (var k=0;k<this.tilesacross;k++) 
			{
				temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);
				
				if (temp.Intersects(box) && this.tiles[i][k]!=0) 
				{
					return true;
				}
			}
		}
		return false;
	}
	
	this.Step = function(players)
	{
		var temp = new Bbox(0,0,0,0);
		this.collidingWithPlayer = [false, false];
		
		for (var k=0; k<2; k++) {
			if (players[k]==null) continue;

			for (var i=0;i<this.tilesdown;i++) 
			{
				for (var k=0;k<this.tilesacross;k++) 
				{
					temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);
					if (temp.Intersects(players[k].bbox) && this.tiles[i][k]!=0) this.collidingWithPlayer[k] = true;
				}
			}
		}
	};

	this.Render = function (ctx)
	{
		//removed
	};
}

/*
*
* P O D
*
*/

Pod = function(num) 
{
    this.width              = this.height = 480;
    this.name               = "Pod " + num;
    this.bg                 = new Bbox(0,0,this.width, this.height);
	this.map				= new TileMap(this.width, this.height, 15, 15);

    this.Step = function(players) {
    	this.map.Step(players);
    }
    this.Render = function(ctx)
    {
        //removed
    };
}

/*
*
* H U N T E R
*
*/

var Arrow = function(start, end, power, pod, pname) 
{
    this.position = new Vector2(start.x, start.y);
    this.podIndex = pod;
    this.name = pname;

    var xcomp = end.x-start.x;
    var ycomp = end.y-start.y;
    var mag = Math.sqrt(Math.pow(xcomp,2) + Math.pow(ycomp,2));
    var launchvel = power;

    this.velocity = new Vector2(xcomp/mag*launchvel,ycomp/mag*launchvel);
    this.bbox = new Bbox(this.position.x, this.position.y, 10, 10);
    this.direction = this.velocity.Direction();
}

var Hunter = function(n, p, a) 
{
    this.name = n;
    this.hitpoints = 1;
    this.bbox = new Bbox(p.x, p.y, 32, 32);
    this.position = p;
    this.velocity = new Vector2(0,0);
	this.walkSpeed = 3;
    this.arena = a;
    this.temp = new Bbox(0,0,0,0);
    this.podIndex=2;
    this.uuid;

    this.dir=0;

    this.a_drawing = false;
    this.a_power = 0;

    this.packet = {
    	position:this.position,
    	velocity:this.velocity,
    	podIndex:this.podIndex,
    	name:this.name
    };

    this.Step = function()
    {
        this.bbox.x = this.position.x;
        this.bbox.y = this.position.y;

        if (this.a_drawing && (this.a_power+0.5)<=24) {
            this.a_power += (0.5);
        }

        this.packet = {
    		position:this.position,
    		velocity:this.velocity,
    		podIndex:this.podIndex,
    		name:this.name
    	};
    }

    this.Render = function(ctx) {
        //removed
    }
	
	this.Walk = function(direction) {
		this.velocity.x = this.walkSpeed*direction;
	}

    this.Draw = function() {
        this.a_drawing=true;
    }

    this.Shoot = function(target) {
        if (this.a_power==0) return;
        var arrow = new Arrow(new Vector2(this.position.x, this.position.y), target, this.a_power, this.podIndex, this.name);
        this.arena.arrow_count+=1;
        this.arena.quiver[this.arena.arrow_count-1] = arrow;
        this.a_drawing = false;
        this.a_power=0;
    }
}

/*
*
* A R E N A
*
*/

Arena = function(dad)
{
	this.numplayers = 0;
    this.players = [];
    this.match = dad;

    this.pods = new Array(new Pod(1), new Pod(2), new Pod(3));

    this.quiver = {};
    this.arrow_count = 0;

    this.packet = {
    	quiver: this.quiver,
    	arrowcount:this.arrow_count
    };

    this.hasVacancy = function() {
        return (this.numplayers==1);
    }
	
	this.IsHitting = function(obj) {//TODO FIX
		return this.pods[obj.podIndex].map.CheckCollision(obj.bbox);
	}
	
	this.IsHittingPlayer = function(index) {
		return this.pods[this.players[index].podIndex].map.collidingWithPlayer[index];
	}

    this.Step = function()
    {
    	this.packet = {
    		quiver: this.quiver,
    		arrowcount:this.arrow_count
    	};

        for (var i = 0; i < this.numplayers; i++) {
			if (this.players[i] !=null) {
				this.players[i].Step();
				this.pods[this.players[i].podIndex].Step(this.players[i]); //update tilesest
			}
		}
        
        for (var i = 0; i < this.arrow_count; i++)
        {
            physics(this.quiver[i], true, this);
            this.quiver[i].bbox.x = this.quiver[i].position.x;
            this.quiver[i].bbox.y = this.quiver[i].position.y;

            if (!this.IsHitting(this.quiver[i])) {
                this.quiver[i].direction = this.quiver[i].velocity.Direction();
            }

            for (var p = 0; p < 2; p++) {
            	if (this.players[p]!=null && this.quiver[i].bbox.Intersects(this.players[p].bbox) && (this.quiver[i].name!=this.players[p].name) && (this.quiver[i].velocity.Length()>0.1) && (this.quiver[i].podIndex == this.players[p].podIndex)) {

            		io.to(this.match.GetOpponentById(this.players[p].uuid).uuid).emit("MatchEnd", true);
            		io.to(this.players[p].uuid).emit("MatchEnd", false);
            	}
        	}
        }

    }

    this.Render = function(ctx)
    {
        //removd.
    };
}

/*
*
*S E R V E R   D E P E N D E N C I E S
*
*/

var port = 420;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'jade');

require("node-import");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var uuid = require("node-uuid");
app.use(express.static(__dirname + "/static"));

/*
*
* R O U T E S
*
*/

app.get('/', function(req, res) {
	res.render("index", {visibility:'display:none'});
	console.log("get request sent to homepage");
});

app.get('/match', function(req, res) {
	res.redirect("/");
	console.log("get request sent to /match");
});

app.post('/match', function(req, res) {
	console.log("post request sent to /match");
	var username = req.body.user;
	if (username==null || username=="" || String(username).length<=1) {
		res.render("index", {visibility:''});
		console.log("name " + username + " is unacceptable.");
	}
	else {
		res.render('match', { title: "OneVeeOne - "+username, username: username});
		console.log("name " + username + " is acceptable!");
	}
});

var server = http.listen(port, function() {
	console.log("Server started on port " + port + ", blaze it m8.");
});

/*
*
* S E R V E R   L O G I C   /   L O O P   /   N E T C O D E
*
*/

var runningMatches=0;

var Match = function() {
	this.uuid = uuid.v4();
	this.arena = new Arena(this);

	this.Alert = function(msg) {
		io.to(this.uuid).emit("Alert", msg);
	}

	this.Broadcast = function() {
		//io.to(this.uuid).emit('ServerUpdate', this.arena.players);
	}

	this.Update = function() {
		for (var i = 0; i < this.arena.numplayers; i++) {
			if (this.arena.players[i]!=null)
			physics(this.arena.players[i], false, this.arena);
		}
		this.arena.Step();
		this.Broadcast();

	}

	this.GetPlayerById = function(id) {
		for (var i = 0; i < this.arena.numplayers; i++) {
			if (this.arena.players[i] !=null && this.arena.players[i].uuid == id) return this.arena.players[i];
		}
		return null;
	}
	
	this.GetOpponentById = function(id) {
		var index=null;
		for (var i = 0; i < this.arena.numplayers; i++) {
			if (this.arena.players[i] !=null && this.arena.players[i].uuid == id) index=i;
		}
		var o = (!index) === true ? 1 : 0
		return this.arena.players[o];
	}

	this.GetPlayerByIndex = function(index) {
		return this.arena.players[index];
	}



	this.RemovePlayerById = function(id) {
		for (var i = 0; i < this.arena.numplayers; i++) {
			if (this.arena.players[i]!=null && this.arena.players[i].uuid == id)  {
				this.arena.players[i]=null;
				this.arena.numplayers-=1;
				console.log("successfully removed player "+id+" from match. Match now has " +this.arena.numplayers+ " players.");
				break;
			}
		}
	}

	this.SetPlayer = function(index, plr) {
		this.arena.players[index] = plr;
		this.arena.numplayers++;
		return this.arena.players[index];
	}
}

var matches = [];

//MATCH SORTING (DUH)
var SortMatches = function() {
	var rm = runningMatches+1;
	for (var i = 0; i < rm; i++) {
		if (matches[i]==null) {
			matches[i] = matches[i+1];
			matches[i+1] = null;
		}
	}
}

//WARNING - POORLY COMMENTED SPAGHETTI NETCODE AHEAD D:
io.on('connection', function(socket) {
	console.log('User connected, id: ' + socket.id);

	//SETUP AND JOINING
	socket.on('JoinRequest', function(name) {
			console.log("join request received from " + name);
			var foundmatch = false;
			for (var i = 0; i < runningMatches; i++) {
				if (matches[i]!=null && matches[i].arena.hasVacancy()) {

					foundmatch=true; console.log("match found");

					var h =  new Hunter(name, new Vector2(50,50), matches[i].arena);

					matches[i].SetPlayer(1,h).uuid = socket.id;
					socket.join(matches[i].uuid); //put them in the room for their match
					socket.match = matches[i];

					socket.emit("RecvID", matches[i].uuid);
					socket.emit("Alert", "joined a match with an existing player, named " + matches[i].GetPlayerByIndex(0).name);
					io.to(matches[i].GetOpponentById(socket.id).uuid).emit("Alert", "Player named " + h.name + " joined the match!");
					io.to(matches[i].uuid).emit("LateJoin");
				}
			}

			if (!foundmatch) {
				console.log("no open matches");

				runningMatches++;
				matches[runningMatches-1] = new Match();

				var h =  new Hunter(name, new Vector2(100,50), matches[runningMatches-1].arena);

				matches[runningMatches-1].SetPlayer(0,h, matches[i].arena).uuid = socket.id;
				socket.join(matches[runningMatches-1].uuid); //put them in the new, empty match
				socket.match = matches[runningMatches-1];

				socket.emit("RecvID", matches[runningMatches-1].uuid);
				matches[runningMatches-1].Alert("No open matches, waiting for an opponent...");
			}
	});

	//SENDING UPDATE PACKETS
	socket.on('MatchStateRequest', function() {
		process.nextTick(function() {
			try {
				if (socket.match!=null) {
					if (socket.match.GetPlayerById(socket.id)!=null)
					socket.emit("YourState", socket.match.GetPlayerById(socket.id).packet);

					if (socket.match.GetOpponentById(socket.id)!=null)
						if (socket.match.GetOpponentById(socket.id).podIndex == socket.match.GetPlayerById(socket.id).podIndex)
							socket.emit("TheirState", socket.match.GetOpponentById(socket.id).packet);

					if (socket.match.arena != null)
					socket.emit("ArenaState", socket.match.arena.packet);
				}
			} catch (e) {
				console.log("error sending match request.");
			}
		});
	});

	//HANDLING USER INPUT (MIGHT BE ISSUES WITH BBOXES? JUST SOME FORESIGHT)
	socket.on('Ijump', function() {
		if (socket.match==null) {return;}

		console.log("player jump!");
		socket.match.GetPlayerById(socket.id).velocity.y = -7;
	});
	socket.on('Ikd', function(code) {
		if (socket.match==null) {return;}

		switch (code) {
			case 65: socket.match.GetPlayerById(socket.id).velocity.x=-4; socket.match.GetPlayerById(socket.id).dir=-1; break;
			case 68: socket.match.GetPlayerById(socket.id).velocity.x=4; socket.match.GetPlayerById(socket.id).dir=1; break;
		}
		console.log("player movement");
	});
	socket.on('Iku', function(code) {
		if (socket.match==null) {return;}

		switch (code) {
			case 65: if (socket.match.GetPlayerById(socket.id).dir==-1) socket.match.GetPlayerById(socket.id).velocity.x=0; break;
			case 68: if (socket.match.GetPlayerById(socket.id).dir==1) socket.match.GetPlayerById(socket.id).velocity.x=0; break;
		}
		console.log("player stops movement");
	});
	socket.on('Imd', function() {
		if (socket.match==null) {return;}

		console.log("player charging...");
		socket.match.GetPlayerById(socket.id).Draw();
	});
	socket.on('Imu', function(pos) {
		if (socket.match==null) {return;}

		console.log("player shot!");
		socket.match.GetPlayerById(socket.id).Shoot(pos);
	});

	
	//LEAVING THE MATCH - DICSONNECTING
	socket.on('disconnect', function() {
			console.log('User disconnected');

			process.nextTick(function() {
				if (socket.match!=null) {
					socket.match.Alert("A player has disconnected. :(");

					socket.match.RemovePlayerById(socket.id);

					if (socket.match.arena.numplayers==0) {
						console.log("Match "+socket.match.uuid+" has no players, and will be deleted.");
						for (var i = 0; i < runningMatches; i++) {
							if (matches[i]!=null && (matches[i].uuid == socket.match.uuid)) {
								matches[i]=null;
								runningMatches-=1;
								SortMatches();
							}
						}
					}
				}
			});
	});

	
});

var ticks=0;
var second1 = Date.now();
var second2 = second1;

/*function serverBoadcastLoop() {



  	second2 = Date.now();
	if (second2-second1 >= 200) {
		second1 = Date.now();
		second2 = second1;
		serverBoadcastLoop();
	}
}*/

var serverGameLoop = function() {
  
  for (var i=0; i<runningMatches; i++) {
  	matches[i].Update();
  }


}

serverGameLoop();
setInterval(serverGameLoop, 1000/50);