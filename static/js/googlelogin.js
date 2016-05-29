
function logout()
{
    gapi.auth.signOut();
    location.reload();
}
function login() 
{
  var myParams = {
    'clientid' : '1062994498861-jlgeajom44n3t7es8lr4q15b2a8ctbhv.apps.googleusercontent.com',
    'cookiepolicy' : 'single_host_origin',
    'callback' : 'loginCallback',
    'approvalprompt':'force',
    'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
  };
  gapi.auth.signIn(myParams);
}
 
function loginCallback(result)
{
		displayingPopUp("Please Wait....");
	console.log(result);
	accessToken = result['access_token'];
	idtoken= result['id_token'];
    if(result['status']['signed_in'])
    {
        var request = gapi.client.plus.people.get(
        {
            'userId': 'me'
        });
        request.execute(function (resp)
        {
			
            var mail = '';
            if(resp['emails'])
            {
                for(i = 0; i < resp['emails'].length; i++)
                {
                    if(resp['emails'][i]['type'] == 'account')
                    {
                        mail = resp['emails'][i]['value'];
                    }
                }
            }
			//console.log(resp);
			name = resp['displayName'];
            image =resp['image']['url'];
			//image = resp['url'];
			imageurl = image;
			email = mail;
			type  = "gplus";
			socialid=resp['id'];
			console.log(image)
			socialRegistration(  );
        });
    } 
}
function onLoadCallback()
{
    gapi.client.setApiKey('AIzaSyDUe9ozF6SZcmfjWSXP31RuzQSIAa0U_Us');
    gapi.client.load('plus', 'v1',function(){});
}
(function() {
       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
       po.src = 'https://apis.google.com/js/client.js?onload=onLoadCallback';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();