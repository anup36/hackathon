var anchorToHide; 
$(document).ready(function() {
	$('.arrowup').click(function() {
		postId	= $(this).parent().find('.content_pid').val();
		type	= $(this).parent().find('.typeofpost').val(); 	
		var ucount = $(this).parent().find('.ucount');
		if( !$(this).next().hasClass('btn-primary') ) {
			
			if(!$(this).hasClass('btn-primary')){
				$(this).addClass('btn-primary active');
				
				$(ucount).text( parseInt($(ucount).text())+1   );
				toggleVotes(postId,type,"upvote");
			}
		}else{
			$(this).next().removeClass('btn-primary active');
			$(this).addClass('btn-primary active');
			$(ucount).text( parseInt($(ucount).text())+1   );
			toggleVotes(postId,type,"upvote");
		}

	});
	$('.arrowdown').click(function() {
		postId = $(this).parent().find('.content_pid').val();
		type	= $(this).parent().find('.typeofpost').val(); 
		var ucount = $(this).parent().find('.ucount');
		if( !$(this).prev().hasClass('btn-primary') ) {
			$(this).addClass('btn-primary active');
			
			if( (parseInt($(ucount).text()))!=0  ){
				$(ucount).text( parseInt($(ucount).text())-1   );
			}
			
		}else{
			$(this).prev().removeClass('btn-primary active');
			$(this).addClass('btn-primary active');
			if( (parseInt($(ucount).text()))!=0  )		{	
				$(ucount).text( parseInt($(ucount).text())-1   );
			}
		}
	toggleVotes(postId,type,"downvote");
	});

$('.submitComment').click(function() {
								// reach <p>
	var btnCheckBoxContainer = $(this).parent();
	
	console.log( $(this).parent().parent().attr('class') );
						//reach <sm-12>
	var comment = btnCheckBoxContainer.parent().find('.mycomment').val().replace(/</g,'&lt;');
	var postId	= btnCheckBoxContainer.parent().parent().attr('class').split(' ')[1];
	console.log(postId);
	
	
	if(comment.trim().length==0)
		return false;
	
	btnCheckBoxContainer.parent().find('.mycomment').val('');
	
	var checkbox = $(btnCheckBoxContainer).find('input');
	var rowDiv = $(btnCheckBoxContainer).parent().parent();
	var commentorName=name;
	var commentorImage = image;
	if(checkbox.is(':checked')){
		commentorName="Anonymous";
		commentorImage="<img src='/static/images/anon.gif' class='img-thumbnail' style='max-width:32px;max-height:40px'>";
	}

	var text = "<div class='col-sm-12 "+postId+"'><span style='display:table-cell'>"+commentorImage+"</span><span style='display:table-cell'><b>"+commentorName+"</b><br>"+comment+"<br> </span></div>";
	$(rowDiv).append(text);
	saveComment(postId,"post",commentorName,-1,comment);
});
hmyname();
upvoteAsResponse();	
});
function upvoteAsResponse() {
	$('.upvoteAsResponse').click(function() {
		
		var upcount = $(this).parent().find('.ucount_comment');
		var targetPost = $(this).parent().parent().attr('class').split(' ')[1];
		var seqForUser  = $(this).attr('class').split(' ');
		var seq = seqForUser[1];
		var foruser = seqForUser[2];
		var commentBelongTo = seqForUser[3];
		
		if($(this).text()=="Upvote") {
			$(this).text('Upvoted') 

			$(upcount).text( parseInt( $(upcount).text() )+1 )
		}else
			{
			$(this).text('Upvote');
			$(upcount).text( parseInt( $(upcount).text() )-1 )
			}
	upvoteComment(targetPost,foruser,seq,commentBelongTo);		
	});
}

function hmyname() {
$('.hmyname').click(function() {
	   var checkbox=$(this).prev();
	   $(checkbox).prop('checked', !$(checkbox).is(":checked"));
});
}
function toggleVotes(postid,type ,signal) {

$.post("/item/action/votes",{"id" : postid , "typeofpost" : type ,"signal" : signal }).done(function(output) {
		console.log(output);
	}).fail(function(err) { 
		console.log(err);
		toggleVotes(postid,type ,signal);
	})
}

function recoverGreyBtn() {
				$('.follownumber').text( parseInt($('.follownumber').text())-1  ); 
				$('#followStatus').removeClass('btn-success');
				$('#followStatus').addClass('btn-default followBtn');
				$('#followStatus').html("<i class='glyphicon glyphicon-plus'></i> Follow");
				var i =$('#followStatus').find('i');
				$(i).removeClass('glyphicon-ok-sign');
				$(i).addClass('glyphicon-plus');
				$('#smallBox').modal('hide');
}

 function expandTODO(num) {
     $(num).get( 0 ).addEventListener('keyup', function() {
        this.style.overflow = 'hidden';
        this.style.height = 0;
        this.style.height = this.scrollHeight + 'px';
    }, false);
}
function childReply(element) {
 var findingNimo = $(element).parent().parent();
 var p=$(element).parent().prev();
 var textArea = $(p).val().trim();
 
 	if(textArea.length==0)
		return false;
 
 console.log(findingNimo);
 
	var commentorName=name;
	var commentorImage = image;
	if( $(element).parent().find('.childcheck').is(':checked')){
		commentorName="Anonymous";
		commentorImage="<img src='/static/images/anon.gif' class='img-thumbnail' style='max-width:32px;max-height:40px'>";
	}

	var postid = $(findingNimo).attr('class').split(' ')[1];
 $(findingNimo).parent().append("<div class='col-sm-12'><span style='display:table-cell'>"+commentorImage+"</span><span style='display:table-cell'><b>"+commentorName+"</b><br>"+textArea+"<br><a href='javascript:void(0)' rel='no-follow'>Upvote</a> </span></div>");
 $(findingNimo).remove();
	
	$(anchorToHide).show();
	
}
function responseComment(element) {

	var parentDiv = $(element).parent().parent();
	var postid =  $(parentDiv).attr('class').split(' ')[1];
	$(element).hide();
	$(parentDiv).append("<div><div class='col-sm-12 "+postid+"'> <textarea class='mycomment'></textarea><p class='pull-right'> <input type='checkbox' class='childcheck'><a href='javascript:void(0)' class='hmyname'>Hide My Name</a> <button class='btn btn-primary btn-sm' onclick='childReply(this)'>Submit</button></p></div></div>");
	hmyname();
	anchorToHide = element;
	$(element).hide();
}
function saveComment(id,type,commentor,parentTarget,text) {

	if(type == "post") {
		
		$.post("/item/action/addcomment",{ "postid" : id , "comment" : text  , "parenttarget" : parentTarget , "type" : type ,"commentor" : commentor  }).done(function(output) {
			
			if(status==200) {
	
			}
			else {			
			}
		console.log(output)
		}).fail(function(err) {
		
		console.log(err);
		//saveComment(id,type,comment,parentTarget);
		});	
	}
}
function upvoteComment(targetPost,foruser,seq ,commentBelongTo) {
	$.post("/item/action/upvotecomment",{ "targetpost" : targetPost , "foruser" : foruser , "seq" : seq , "typeofcontent" : commentBelongTo  }).done(function(output) {
		console.log(output);
	}).fail(function(err) {
		console.log(err);
	});
}