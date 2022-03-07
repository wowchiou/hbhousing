var userData = {};
//  Facebook API
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/zh_TW/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

window.fbAsyncInit = function () {
  FB.init({
    appId: '2336260206441712',
    xfbml: true,
    version: 'v3.3',
  });

  // 如需載入頁面後檢查FB登入狀態,觸發fbload事件
  // $(document).trigger('fbload');
};

$(document).on('fbload', function () {
  FB.getLoginStatus(function (res) {
    if (res.status == 'connected') {
      userData.fb_accessToken = res.authResponse.accessToken;
      FB.api('/me?fields=id,name,email', function (user) {
        userData.fb_id = user.id;
        userData.fb_name = user.name;
      });
    }
  });
});

function facebookLogin(callback) {
  FB.getLoginStatus(function (res) {
    if (res.status == 'connected') {
      userData.fb_accessToken = res.authResponse.accessToken;
      FB.api('/me?fields=id,name,email', function (user) {
        userData.fb_id = user.id;
        userData.fb_name = user.name;
        callback && typeof callback === 'function' && callback(userData);
      });
    } else {
      FB.login(function (res) {
        if (res.status == 'connected') {
          userData.fb_accessToken = res.authResponse.accessToken;
          FB.api('/me?fields=id,name,email', function (user) {
            if (user.name) {
              userData.fb_id = user.id;
              userData.fb_name = user.name;
              callback && typeof callback === 'function' && callback(userData);
            }
          });
        } else {
          callback && typeof callback === 'function' && callback(res);
        }
      });
    }
  });
}

function fbShare(url, callback) {
  FB.ui(
    {
      method: 'share',
      display: 'popup',
      href: url,
    },
    function (response) {
      callback && typeof callback === 'function' && callback(response);
    }
  );
}
