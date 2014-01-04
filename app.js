var	express = require("express"),
	app = express(),
	fs = require("fs"),
	request = require('superagent'),
	exec = require('child_process').exec;

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
			//screen.switch_to('sudo', ['fbi','-T','1','/tmp/imageToShow']);
			res.end('ok');
		});
	} catch(e){
		res.end("error");
	}
});

app.get('/cmd/restart', function(req, res){
	res.end("ok")
	process.exit();
});

app.get('/cmd/youtube', function(req, res){
	console.log("YouTube Video Grabbing...");
	swapCommand(new commands.ImageViewer( __dirname + '/public/load.gif' ));
	exec('youtube-dl -g ' + req.query.url, function (error, stdout, stderr) {
		swapCommand(new commands.MediaPlayer( stdout.replace('\n', '') ));
		//screen.switch_to('omxplayer', [stdout.replace('\n', '')]);
		res.end("ok");
	});
	
});

app.use(express.static(__dirname + '/public'))

var port = 3000;
console.log("SimpleMC Live on port " + 3000);
app.listen(port);
