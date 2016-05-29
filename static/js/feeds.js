var obj = {"oldPostIdTime" : 10000000000000 , "newPostIdTime" : 0};
function generateUserContent(signal) {
if(signal!=1)
	$('#pleaseWait').show();

$.ajax({
		url: '/generateUserContent',
		type: "POST",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		dataType	: 'json',
		xhr: function() {
		myXhr = $.ajaxSettings.xhr();
		if(myXhr.upload){
				myXhr.upload.addEventListener('progress',progressHandlerFunctionAnswer, false);
		}
		return myXhr;
		},
		success: function ( output ) 
		{
		if(output.status==200) {
						var min = 0;
						var content = output.data.posts;
						var dynamicHTML="";
						console.log(content.length);
						for(var i=0;i<content.length;i++) {
							
							if(obj.oldPostIdTime > content[i].creationtime )
								obj['oldPostIdTime'] = content[i].creationtime;
							
		dynamicHTML=dynamicHTML+"<div class='col-sm-12'>"+
									"<div class='panel panel-default'>"+
											"<div class='panel-heading' style='background:#fff'>"+
												"Published by : "+content[i].author+
											"</div>"+
											"<div class='panel-body'>"+
											"<strong class='postTitle'>"+content[i].title+"</strong><br>"+
												"<span class='fixFont'>"+content[i].description+"</span>"+
											"</div>"+
											"<p style='padding-left:2%'>";
												userids = content[i].upvotedby;
												useridsDown = content[i].downvotedby;
												isUpvoted = "btn-default";
												isDownvoted = "btn-default";
												for(var upcheck=0;upcheck<userids.length;upcheck++){
													if(userids[upcheck] == $('#myId').val() ){
														console.log("This content is upvoted by you")
														isUpvoted="btn-primary";
														break;
													}
												}
												for(var downcheck=0;downcheck<useridsDown.length;downcheck++) {
													if( useridsDown[downcheck] == $('#myId').val() ) {
														console.log("This comment was downvoted by you");
														isDownvoted="btn-primary";
														break;
													}
												}
											
				dynamicHTML=dynamicHTML+"<button class='btn "+isUpvoted+" btn-sm arrowup'><i class='glyphicon glyphicon-arrow-up'></i></button>"+
												"<button class='btn "+isDownvoted+" btn-sm arrowdown'><i class='glyphicon glyphicon-arrow-down'></i></button>"+
													"<span class='help-text'>&nbsp;<span class='ucount'>"+content[i].upvotecount+"</span> Upvotes</span>"+
												"<input type='hidden' value="+content[i]._id+" class='content_pid'>"+
												"<input type='hidden' value='post' class='typeofpost'>"+
											"</p>"+
											"<div class='panel-footer' style='word-wrap:break-word'>"+
													"<div class='row "+content[i]._id+"' >"+
														"<div class='col-sm-12'>"+
															"<textarea class='mycomment' onfocus='expandTODO(this)'></textarea>"+
															"<p class='text-right' style='padding-top:0.5%'>"+
																"<input type='checkbox'> <a href='javascript:void(0)' class='hmyname'>Hide My Name</a> "+
																"<button class='btn btn-primary submitComment'>Submit</button>"+
															"</p>"+
															"<p class='hasComments'></p>"+
														"</div>";
														var comm = content[i].comments;
														 for(var y=0 ; y<comm.length;y++) {
								dynamicHTML=dynamicHTML+"<div class='col-sm-12 "+content[i]._id+" loadComments'>"+
																"<span class='tbl-cell'>"+
																	"<img src='"+comm[y].image+"' class='img-thumbnail' style='max-height:40px;max-width:80px'>"+
																"</span>"+
																"<span class='tbl-cell'>"+
																	"<b>&nbsp;"+comm[y].author+"</b>"+
																	"<br> "+comm[y].text+"</br>"+
																	
																	"<a href='javascript:void(0)' rel='no-follow' class='upvoteAsResponse "+comm[y].sequence+" "+comm[y].userid+" post'>Upvote</a>"+
																	"<small class='glyphicon glyphicon-arrow-up' style='color:#bbb'></small> . <span class='ucount_comment'>"+comm[y].upvotecount+"</span>"+
																"</span>"+
															"</div>";
														
														 }
														
						dynamicHTML=dynamicHTML+"</div>"+
											"</div>"+
										"</div>"+
									"</div>";
						}
						$('#lazyLoad').remove();
						var loadmore = "<div class='col-sm-12'  id='lazyLoad'><div class='well well-sm'><button class='btn btn-default' onclick='generateUserContent(2)'>Load Previous Stories</button><span id='pleaseWait'>Please Wait...</span></div></div>";
							
						if(signal==1){
							$('#contentStories').prepend(dynamicHTML);
						}else{
							$('#contentStories').append(dynamicHTML);
						}
						$('#contentStories').append(loadmore);
						$('#pleaseWait').hide();
						
						$('#progressBeforeStory').hide();
								elipseMakr();
								configureUpvotesDownvotes();
								configComments();
								upvoteAsResponse();	
								hmyname();
						//scrollcheck();
						console.log(obj);
		}
		else {
			console.log(output.reason);
		}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) { 
				console.log(textStatus +" "+ errorThrown); 
			}
		});
	    var $modal     = $('.modal-dialog')
      , $backdrop  = $('.modal-backdrop')
      , el_height  = $modal.innerHeight();
    $backdrop.css({
        height: el_height + 20,
        minHeight: '100%',
        margin: 'auto'
    });
    $modal.css({
        padding: '4px',
        maxWidth: '900px',
        margin: '10px auto'
    });	
			
	}
			
function progressHandlerFunctionAnswer(e)
{
    console.log(e.total+" "+e.loaded);
	total = (e.loaded / e.total )* 100 ;
	console.log(total);
	$('.loader').css('width',total+"%");
}
generateUserContent(1);
function elipseMakr() { 
	// making ellipsis 
	$('.fixFont').each(function() {
		// fetch all the original text and length
		var text = $(this).html()
		var tlength = text.length;
		// show all text if <400 otherwise
		// trim to half and insert span in between and then call hide function to this tag
		if(tlength<400){
			$(this).html( text );
			}
		else {
			//below line thanks to http://stackoverflow.com/users/1386886/jandy
			
			var last = text.slice(400);
			var findSpace = last.indexOf(' ');
			$(this).html( [text.slice(0,400) ,'<span class="elipText" style="display:none">' , text.slice(400)+"</span><a href='javascript:void(0)' class='seeMore' rel='nofollow'>...Read More</a>"].join('') );
			
			//var output = [text.slice(0, mid), "", text.slice((findSpace+1))].join('');
			//$(this).html( text.substring(0,(tlength/2)) +"...<a href='#' rel='no-follow'>Read More</a> " );
			
			}
		
		//console.log( freefromstl );
	});
	$('.seeMore').click(function() {
		$('#menu2').html($(this).parent().parent().parent().parent().parent().html());
		$('#menu2').find('.elipText').css('display','inherit');
		$('#menu2').find('.seeMore').remove();
		$('.nav-pills a[href="#menu2"]').tab('show');
		configureUpvotesDownvotes();
								configComments();
								upvoteAsResponse();	
								hmyname();
		
	});
	$('.loadComments').each(function(){
		$(this).parent().parent().find('.hasComments').html("<div class='well well-sm'><a href='javascript:void(0)' onclick='showFullhascomments(this)'>Load Comments <i class='glyphicon glyphicon-chevron-down'></i></a></div>");
		$(this).slideUp();
		
	});
}

function showFullhascomments(element) {
	
	$(element).parent().parent().parent().parent().find('.loadComments').each(function() {
		if($(element).text()=="Load Comments ") {
			$(element).html('Hide Comments <i class="glyphicon glyphicon-chevron-up"></i>');
		}
		else { 
			$(element).html('Load Comments <i class="glyphicon glyphicon-chevron-down"></i>');
		}
		$(this).slideToggle();
	})
}

function configureUpvotesDownvotes(){
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
}
function toggleVotes(postid,type ,signal) {
$.post("/item/action/votes",{"id" : postid , "typeofpost" : type ,"signal" : signal }).done(function(output) {
		console.log(output);
	}).fail(function(err) { 
		console.log(err);
		toggleVotes(postid,type ,signal);
	})
}
function configComments() {
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
}
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

function collapseElements(element) {
	$(element).toggle();
}