function launchSuperModal(element) {
	$('#superModal').modal('show');
	$('#messageText').attr("autofocus","autofocus")
	$( "#messageText" ).trigger( "click" );
	if($(element).attr('id')=='editQuoteBtn') {
		$('#sendMsgBoxBtn').attr('onclick','updateDescription()');
		$('#sendMsgBoxBtn').text('Save Quote');
		$('#messageText').attr('placeholder',$('.editQuote').text());
		$('#myModalLabelQuote').html('Write your favourite quote <i class="glyphicon glyphicon-edit"></i>');
	}
}
function sendMessage() {
	var message = $('#messageText').val().trim();
	if(message.length==0) {
		
	$('.feedbackModal').html("<br><div class='alert alert-danger'> Please Type A Message</div>");
	setTimeout(function(){   $('.feedbackModal').html('');  },5000);
	
	}
	else {
		var sendAs="myself";
		if($('.sendAs').is(":checked"))
			sendAs = $('.sendAs').val();
		
		$.post("/item/action/sendMessage",{"message" : message , "sendAs" : sendAs , "target" : pageOwnerId }).done(function(data) {
			
			console.log(data);
			$('#messageText').val('');
		}).fail(function(data) {
			
			
			console.log(data);
		})
	}
		$('#superModal').modal('hide');
}
function updateDescription() {
	var msg = $('#messageText').val().trim();
	hidePopUp();
	if(msg.length>0) {
	$.post('/items/action/updateDescription',{ "text" : $('#messageText').val() }).done(function(data) {
			
			if(data.status!=200) {
				
				displayingPopUp("Quote Updation Failed <button class='btn btn-danger' onclick='updateDescription()'> Re-Try </button>");
			}
			
		
	}).fail(function(data) {
		displayingPopUp("Quote Updation Failed <button class='btn btn-danger' onclick='updateDescription()'> Re-Try </button>");
	
		
	});
	$('#superModal').modal('hide');
	$('.editQuote').text("''"+$('#messageText').val()+"''");
	}
}