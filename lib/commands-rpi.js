// SimpleMC CommandSet for Raspberry Pi
var spawn = require('child_process').spawn,
	linkProcess = require('./util.js').linkProcess;

/**
 * Image Viewer
 * @constructor
 */
function ImageViewer(file){
	this.file = file;
}

ImageViewer.prototype.launch = function(){
	this.process = spawn('sudo', ['fbi', '-T', '1', this.file]);
	linkProcess(this.process);
};

ImageViewer.prototype.quit = function(){
	this.process.kill();
};

/**
 * Media Player
 * @constructor
 */
function MediaPlayer(file){
	this.file = file;
}

MediaPlayer.prototype.launch = function(){
	this.process = spawn('omxplayer', [this.file]);
	linkProcess(this.process);
}

MediaPlayer.prototype.quit = function(){
	this.process.stdin.write('q');
}

module.exports = {
	"MediaPlayer" : MediaPlayer,
	"ImageViewer" : ImageViewer
};