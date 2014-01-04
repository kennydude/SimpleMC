var	express = require("express"),
	app = express(),
	fs = require("fs"),
	request = require('superagent');

// Command Set
var os = require('os');
if(os.type() == "Darwin"){
	var commands = require('./lib/commands-osx.js');
} else{
	var commands = require('./lib/commands-rpi.js');
}

var currentCommand = undefined;
function swapCommand(nc){
	if(currentCommand != undefined) currentCommand.quit();
	nc.launch();
	currentCommand = nc;
}

app.use(function(req, res, next){
	res.error = function(d){
		res.status(503).json({
			"status" : "error",
			"error" : d
		});
	};
	next();
});

app.get('/', function(req, res){
	res.redirect('/index.html');
});

app.get('/cmd/wallpaper', function(req, res){
	swapCommand(new commands.ImageViewer( __dirname + "/public/b.jpg" ));
	res.end("ok");
});

app.get('/cmd/showimg', function(req, res){
	try{
		var ireq = request.get(req.query.url);
		var stream = fs.createWriteStream('/tmp/imageToShow');
		ireq.pipe(stream);
		ireq.on('end', function(){
			swapCommand(new commands.ImageViewer( "/tmp/imageToShow" ));
			res.end('ok');
		});
	} catch(e){
		res.end("error");
	}
});

app.get('/cmd/exit', function(req, res){
	res.end("ok")
	process.exit();
});

/*
app.get('/cmd/youtube', function(req, res){
	console.log("YouTube Video Grabbing...");
	swapCommand(new commands.ImageViewer( __dirname + '/public/load.gif' ));
	exec('youtube-dl -g ' + req.query.url, function (error, stdout, stderr) {
		swapCommand(new commands.MediaPlayer( stdout.replace('\n', '') ));
		res.end("ok");
	});
	
});
*/

// Begin Channel API {
	var channels = {};
	fs.readdirSync(__dirname + '/lib/channels').forEach(function(chnl){
		var name = chnl.substr(0, chnl.length - 3); // remove .js
		channels[name] = require('./lib/channels/' + chnl); // include code
		app.get('/channels/' + name, function(req, res, next){
			res.channel_json = function(js){
				res.json({
					"status" : "ok",
					"channel" : name,
					"data" : js
				});
			};
			next();
		}, channels[name].endpoint) // endpoint
	});

	app.get('/channels/list.json', function(req, res){
		var out = [];
		Object.keys(channels).forEach(function(channel){
			out.push({
				"type" : "link",
				"thumbnail" : "/images/channel-" + channel + ".png",
				"title" : channel,
				"link" : "/channels/" + channel
			});
		});
		res.json({
			"status" : "ok",
			"channel" : "home",
			"data" : out
		});
	});

	app.get('/channels/watch/:channel/:videoKey', function(req, res){
		if(!channels[req.params.channel]) return res.error("No such channel");
		swapCommand(new commands.ImageViewer( __dirname + '/public/load.gif' ));
		console.log("Getting streaming url");
		channels[req.params.channel].getStreamingURL(req.params.videoKey, function(err, url){
			if(!url) return res.error("Technical glitch: " + err);
			swapCommand(new commands.MediaPlayer( url ));
			res.json({
				"status" : "ok"
			});
		});
	});

// } End Channel API

app.use(express.static(__dirname + '/public'));

var port = 3000;
console.log("SimpleMC Live on port " + 3000);
app.listen(port);
