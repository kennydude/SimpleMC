// Channels Client-side
function changeChannel(link){
	$("#channel-content").text("loading...");
	$.get(link, function(data){
		if(data.status == "ok"){
			$("#channel-content").html("");
			data.data.forEach(function(item){
				var div = $("<div>").addClass("channel-item").appendTo("#channel-content");
				$("<img />").addClass("vid-thumb").attr("src", item.thumbnail).appendTo(div);
				$("<h3>").addClass("vid-title").text(item.title).appendTo(div);
				
				if(item.type == "link"){
					div.click(function(){
						changeChannel(item.link);
					});
				} else if(item.type == "video"){
					div.click(function(){
						tuneSet(data.channel, item.watch);
					});
				}
			});
		}
	});
};

function tuneSet(channel, vidKey){
	console.log("Tuning to " + vidKey + "@" + channel);
	$(".cmdRunning").show();
	$.get("/channels/watch/" + channel + "/" + vidKey, function(data){
		if(data.status == "ok"){
			console.log("Tuned in!");
			$(".cmdRunning").hide();
			$(".success").show();
			setTimeout(function(){
				$(".success").fadeOut();
			}, 500);
		}
	});
}

$(document).ready(function(){
	changeChannel("/channels/list.json");
});