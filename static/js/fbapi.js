
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '338514119500740', // App ID
      
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
	FB.Event.subscribe('auth.authResponseChange', function(response) 
	{
 	 if (response.status === 'connected') 
  	{
  		accessToken = response.authResponse.accessToken;
  		//SUCCESS
  		console.log(accessToken);
  	}	 
	else if (response.status === 'not_authorized') 
    {
		//FAILED
    } else 
    {
    	//UNKNOWN ERROR
    }
	});	
	
    };
   	function Login()
	{

		FB.login(function(response) {
		   if (response.authResponse) 
		   {

		    	getUserInfo();
							   displayingPopUp("Please Wait....");
  			} else 
  			{
  	    	 console.log('User cancelled login or did not fully authorize.');
   			}
		 },{scope: 'email,user_photos'});
	}
  function getUserInfo() {

  FB.api('/me', function(response) {
	console.log(response)
 name=response.name;

 socialid=response.id;
 email=response.email;
 type="fb";
 FB.api('/me/picture?type=normal', function(response) {
	  	 imageurl=response.data.url;
	  	 console.log(imageurl);
		 //alert();
		 socialRegistration(  );
		//showTime(pic,id,name,email,"fb");
    }); 	  	    
    });
    }
	function Logout()
	{
		FB.logout(function(){document.location.reload();});
	}

  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_UK/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));