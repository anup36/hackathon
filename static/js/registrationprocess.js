var accessToken="" , socialid="" , imageurl="" , type="custom" ,email , password , confirmpassword , name = "" , idtoken=""  ;

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function socialRegistration(  ) {
	displayingPopUp("Please Wait....");
	$('.row').fadeToggle("slow","linear");
	console.log(email);
	obj={ "name" : name , "createdby" : type , "email" : email , "accesstoken" : accessToken, "socialid" : socialid ,  "image" : imageurl , "idtoken" : idtoken }
	
	$.post("/socialregister",obj).done( function(output) {
		if(output.status==200) {
			
			//if(output.message)
				location.href='/feeds';
			//else
			//	location.href="/dashboard";
			$('.row').fadeToggle("slow","linear");
			hidePopUp();
		}
		else {

			$('.row').fadeToggle("slow","linear");
			displayingPopUp(output.reason);
			setTimeout(function(){ hidePopUp() }, 3000);
		}
		console.log(output);
	}).fail(function(err) {
		displayingPopUp("Please Refresh The Page.Connection Problem");
		//clear();
	});
}
function displayingPopUp(msg)
{
	hidePopUp();
	$('body').append('<div id="my-alert-box" class="my-overlay"><div><p class="text-center"><label>'+msg+'</label></p></div></div>');
}
function hidePopUp()
{
	$('#my-alert-box').remove()
}
