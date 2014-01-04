module.exports = util = {};

util.linkProcess = function(process){
	process.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});
	process.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});
}