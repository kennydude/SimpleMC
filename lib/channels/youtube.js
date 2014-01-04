// YouTube channel
module.exports = YouTubeChannel = {};

var	request = require("superagent"),
	cheerio = require("cheerio"),
	exec = require('child_process').exec,
	linkProcess = require('../util.js').linkProcess;

YouTubeChannel.getStreamingURL = function(video, cb){
	var ydl = exec('youtube-dl -g http://youtube.com/watch?v=' + video, function (error, stdout, stderr) {
		cb(null, stdout.trim());
	});
	linkProcess(ydl);
};

YouTubeChannel.endpoint = function(req, res){
	switch(req.query.type){
		case "search":
			request	.get("http://www.youtube.com/results?search_query=" + req.query.query + "&sm=3")
					.end(function(x_res){
						var $ = cheerio.load(x_res.text);
						var videos = [];
						$(".yt-lockup-video").each(function(){
							var vid = $(this).attr("data-context-item-id");
							videos.push({
								"type" : "video",
								"title" : $(".yt-lockup-title", this).text().trim(),
								"thumbnail" : "http://img.youtube.com/vi/" + vid + "/maxresdefault.jpg",
								"watch" : vid,
								"alternate" : {
									"Channel" : {
										"type" : "list",
										"link" : "/channels/youtube?type=user&channel=" + $(this).attr("data-context-item-user")
									}
								}
							});
						});
						res.channel_json(videos);
					});
			break;
		case "user":
			request	.get("http://www.youtube.com/user/" + req.query.channel + "/videos")
					.end(function(x_res){
						var $ = cheerio.load(x_res.text);
						var videos = [];
						$("#channels-browse-content-grid > li.channels-content-item").each(function(){
							var vid = $(".context-data-item", this).attr("data-context-item-id");
							videos.push({
								"type" : "video",
								"title" : $(".yt-lockup-title", this).text().trim(),
								"thumbnail" : "http://img.youtube.com/vi/" + vid + "/maxresdefault.jpg",
								"watch" : vid
							});
						});
						res.channel_json(videos);
					});
			break;
		default:
			res.channel_json([
					{
						"type" : "link",
						"thumbnail" : "https://pbs.twimg.com/profile_images/417086378023727104/EZjT8YP_.jpeg",
						"title" : "AmazingPhil",
						"link" : "/channels/youtube?type=user&channel=AmazingPhil" 
					}
			]);
	}
};