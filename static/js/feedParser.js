var ids="0";
var signal="1";
function readJobs(){
	$('#jobsFeedRow').html( ""  );
	$.get("/jobfeeds?ids="+ids+"&signal="+signal+"").done(function(data) {
		console.log(data);
			var jsondata = data.data;
			var len = jsondata.length;
			var temp="";
			ids = jsondata[0]._id;
			for(var i=0;i <len ; i++) {
				desc= jsondata[i].description;
				cat = jsondata[i].originateLink;
				if(desc==null)
					desc="Please got to url for full details...."
				temp+='<div class="col-sm-12">'+
						'<div class="panel panel-default">'+
							'<div class="panel-heading"> <label class="label label-default">#'+cat.substring( cat.lastIndexOf('/') )  +'</label></div>'+
								'<div class="widget-content padding">'+
									"<h4><a href='#'>"+jsondata[i].title+"</a></h4>"+
									"<small><i class='glyphicon glyphicon-briefcase'> </i> "+jsondata[i].company+"</small>"+
									'<p>'+
									desc+
									'<a class="btn btn-success btn-sm" href='+jsondata[i].link+'>Go To Link</a>'+
									'</p>'+
									'<p class="label label-info">'+
									jsondata[i].minE +' - '+jsondata[i].maxE+
									' yrs</p>'+
									'<p><small>'+jsondata[i].skills+'</small></p>'+
								'</div>'+
							'<div class="panel-footer"><i class="glyphicon glyphicon-map-marker">  '+jsondata[i].location+
							'</i><p class="pull-right"><i class="fa fa-rupee"></i>'+jsondata[i].ctc+' </p>'+
							'</div>'+
						'</div>'+
						
					'</div>';

				$('#jobsFeedRow').append( temp );
				temp="";
				
			}		
	});
}
function readJobsBasedOnFilter(filter,filterParameter){
	$('#jobsFeedRow').html( ""  );
	jsonToPost ={}
	jsonToPost[filter] = filterParameter
	console.log(jsonToPost, filter);
	$.post("/"+filter,jsonToPost  ).done(function(data) {
		console.log(data);
			var jsondata = data.data;
			var len = jsondata.length;
			var temp="";
			ids = jsondata[0]._id;
			for(var i=0;i <len ; i++) {
				desc= jsondata[i].description;
				cat = jsondata[i].originateLink;
				if(desc==null)
					desc="Please got to url for full details...."
				temp+='<div class="col-sm-12">'+
						'<div class="panel panel-default">'+
							'<div class="panel-heading"> <label class="label label-default">#'+cat.substring( cat.lastIndexOf('/') )  +'</label></div>'+
								'<div class="widget-content padding">'+
									"<h4><a href='#'>"+jsondata[i].title+"</a></h4>"+
									"<small><i class='glyphicon glyphicon-briefcase'> </i> "+jsondata[i].company+"</small>"+
									'<p>'+
									desc+
									'<a class="btn btn-success btn-sm" href='+jsondata[i].link+'>Go To Link</a>'+
									'</p>'+
									'<p class="label label-info">'+
									jsondata[i].minE +' - '+jsondata[i].maxE+
									' yrs</p>'+
									'<p><small>'+jsondata[i].skills+'</small></p>'+
								'</div>'+
							'<div class="panel-footer"><i class="glyphicon glyphicon-map-marker">  '+jsondata[i].location+
							'</i><p class="pull-right"><i class="fa fa-rupee"></i>'+jsondata[i].ctc+' </p>'+
							'</div>'+
						'</div>'+
						
					'</div>';

				$('#jobsFeedRow').append( temp );
				temp="";
				
			}		
	});
}
function controlReadJobs(btnType){
	if(btnType=="prev"){
		signal=0;
	}else{
		signal=1;
	}
	readJobs();

}
readJobs();