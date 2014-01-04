// SimpleMC CommandSet for OSX
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
	this.process = spawn('qlmanage', ['-p', this.file]);
	linkProcess(this.process);
};

ImageViewer.prototype.quit = function(){
	this.process.kill();
};

/**
 * Media Player.
 * VLC is used because it is sane
 * @constructor
 */
function MediaPlayer(file){
	this.file = file;
}

MediaPlayer.prototype.launch = function(){
	this.process = spawn('/Applications/VLC.app/Contents/MacOS/VLC', [this.file]);
	linkProcess(this.process);
}

MediaPlayer.prototype.quit = function(){
	// YAY FOR STUPID STUFF!
	spawn('killall', ['-SIGKILL','VLC']);
}

module.exports = {
	"MediaPlayer" : MediaPlayer,
	"ImageViewer" : ImageViewer
};