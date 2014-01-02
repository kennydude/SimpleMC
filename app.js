var	express = require("express"),
	app = express(),
	fs = require("fs"),
	request = require('superagent'),
	screen = require('./lib/screen');

app.get('/', function(req, res){
	res.redirect('/index.html');
});

app.get('/cmd/wallpaper', function(req, res){
	screen.switch_to('sudo', 'fbi','-T','1','/home/pi/b.jpg']);
	res.end("ok");
});

app.get('/cmd/showimg', function(req, res){
	try{
		var ireq = request.get(req.query.url);
		var stream = fs.createWriteStream('/tmp/imageToShow');
		ireq.pipe(stream);
		ireq.on('end', function(){
			screen.switch_to('sudo', ['fbi','-T','1','/tmp/imageToShow']);
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
	screen.switch_to('sudo', [
		'youtube-dl',
		req.params.url,
		'-o', 
		'-',
		'|',
		'mplayer',
		'-cache',
		'8192',
		'-'
	]);
	res.end("ok");
});

app.use(express.static(__dirname + '/public'))

var port = 3000;
console.log("SimpleMC Live on port " + 3000);
app.listen(port);
