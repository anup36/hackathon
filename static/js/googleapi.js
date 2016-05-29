    function onSuccess(googleUser) {
      
	var profile=googleUser.getBasicProfile();
	console.log(profile)
		//showTime(pic,id,name,email);
		//showTime(profile.getImageUrl() , profile.getId() , profile.getName() , profile.getEmail() ,"google");
    }
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'https://www.googleapis.com/auth/plus.login',
        'width': 195,
        'height': 35,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
    }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }