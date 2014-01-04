// Screen Management Library for SimpleMC
// This manages which command is currently in use
module.exports = screen = {};

var	spawn = require('child_process').spawn,
	process = null;

screen.switch_to = function(cmd, args){
	if(process != null){
		try{
			console.log('terminating old process');
			process.stdin.write('q').flush();//.end();
			//process.kill();
		} catch(e){}
	}
	console.log('screen',cmd,args);
	process = spawn(cmd, args);
	process.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});
	process.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

}