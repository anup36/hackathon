/* thanks to http://stackoverflow.com/users/49852/panman for time elapse code */
function timeSince(date) {

    var seconds = Math.floor(((new Date().getTime()/1000) - date)),
    interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + " year";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " month(s)";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day(s)";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour(s)";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minute(s) ";

    return Math.floor(seconds) + " second(s)";
}

function fetchUserMessageAlerts() {
	
	$.post("/items/action/fetchalertcount").done(function(resp) {
		console.log(resp);
		if(resp.status == 200) {
			var data = resp.data;
			if(parseInt(data.messagecount)!=0 )
			$('#msgnotify').html(data.messagecount);
			
			if(parseInt(data.notificationcount)!=0 )
			$('#alertnotify').html(data.notificationcount);


			var messages = data.messagecontent;
			var messageText = "";
			var dynamicDrops = "";
			
			for(var i=(messages.length)-1;i>=0;i--) {
				messageText = messages[i].message;
				timeelapsed = timeSince( messages[i].creationtime )
				dynamicDrops= dynamicDrops+"<li><a href='/messageBox?"+messages[i].from+"&"+messages[i].creationtime+"'><strong> "+messages[i].name+" </strong><small>"+timeelapsed+" ago </small><br>"+ messageText.substring(0,60)+"...  </a></li><li class='divider'></li>";
				
			}
			$('#dropdownMessages').prepend(dynamicDrops);
			//console.log(data)
									
			var notificationalert = data.notificationalerts.alerts;
			var notificationText = "";
			var dynamicDrops = "";
			
			for(var i=(notificationalert.length)-1;i>=0;i--) {
				
				if(notificationalert[i].purpose==1)
					notificationText="has upvoted your Post";
				else if(notificationalert[i].purpose==2)
					notificationText="has upvoted comment";
				else if(notificationalert[i].purpose==3)
					notificationText="has replied to your post";
				else if(notificationalert[i].purpose==4)
					notificationText="has also commented on the post"
					
				timeelapsed = timeSince( notificationalert[i].creationtime )
				dynamicDrops= dynamicDrops+"<li><a href='/notificationPost/postItem/"+notificationalert[i].contentid+"?cr="+notificationalert[i].datetime+"&fr="+notificationalert[i].fromid+"&st="+notificationalert[i].status+"'><strong> "+notificationalert[i].name+" </strong><small>"+timeelapsed+" ago </small><br>"+ notificationText +" <b>"+ notificationalert[i].content+"</b>...  </a></li><li class='divider'></li>";
				
			}
			$('#dropdownAlert').prepend(dynamicDrops);
			//console.log(data)

			
		
		}
		
		else if(data.status == 202) {
			console.log(data);
		}
		else {
				console.log(data);
		}
		
	}).fail(function(data) {
		
	});	
}
fetchUserMessageAlerts();