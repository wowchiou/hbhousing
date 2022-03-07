(function (global, $) {
  var mg = {};

  // 固定跳窗後背景卷軸
  var pageTop = 0;
  mg.stopBodyScroll = function (isFixed) {
    if (!!mg.detectmobile.isMobile) {
      var bodyEl = document.body;
      if (isFixed) {
        pageTop = window.scrollY;
        bodyEl.style.position = 'fixed';
        bodyEl.style.top = -pageTop + 'px';
      } else {
        bodyEl.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, pageTop);
      }
    } else {
      !!isFixed
        ? $('html').css('overflow', 'hidden')
        : $('html').css('overflow', 'auto');
    }
  };

  mg.detectmobile = {};
  var ua = navigator.userAgent.toLowerCase();
  var MOBILES_NAME /*Array*/ = [
    'android',
    'iphone',
    'windows ce',
    'windows phone',
    'symbian',
    'blackberry',
    'mobile',
    'phone',
    'midp',
    'cldc',
    'opera mini',
    'minimo',
    'up.browser',
    'up.link',
    'docomo',
    'avantgo',
    'palmos',
    'ppc',
    'xv6850',
    'htc_',
    'kindle',
    'wap',
    'mmp/',
    'teleca',
    'lge',
    'portalmmm',
    'nintendo',
    'nokia',
    'armv',
    'j2me',
    'nook browser',
    'webos',
    'blazer',
    'epoc',
    'samsung',
    'novarra-vision',
    'netfront',
    'sec-sgh',
    'sharp',
    'au-mic/1.1.4.0',
    'reqwirelessweb',
    'sonyericsson',
    'playstation',
    'vodafone',
    'ucweb',
  ];

  for (var a in MOBILES_NAME) {
    if (ua.indexOf(MOBILES_NAME[a]) != -1) {
      mg.detectmobile.isMobile = true;
      break;
    }
  }

  if (ua.indexOf('iphone') > -1) mg.detectmobile.isIPhone = true;
  if (ua.indexOf('ipad') > -1) mg.detectmobile.isIPad = true;

  if (ua.indexOf('fbav') != -1) {
    if (ua.indexOf('fb_iab') != -1 || ua.indexOf('fb4a') != -1) {
      mg.detectmobile.fbApp = 'android';
    } else if (ua.indexOf('fban') != -1 || ua.indexOf('fbios') != -1) {
      mg.detectmobile.fbApp = 'ios';
    }
  }

  if (mg.detectmobile.isIPhone || mg.detectmobile.isIPad) {
    if (ua.indexOf('crios') > -1) mg.detectmobile.isIosChrome = true;
  }

  if (ua.indexOf('line') != -1) {
    mg.detectmobile.fbApp = 'ios';
  }

  // 設定scroll bar樣式
  mg.setScroller = function (el) {
    $(el).nanoScroller({
      iOSNativeScrolling: false,
      sliderMinHeight: 0,
      sliderMaxHeight: 62,
      preventPageScrolling: false,
      disableResize: false,
      alwaysVisible: true,
      flashDelay: 1500,
      paneClass: 'nano-pane',
      sliderClass: 'nano-slider',
      contentClass: 'nano-content',
      enabledClass: '__enabled',
      flashedClass: '__flashed',
      activeClass: '__active',
      tabIndex: -1,
    });
  };

  mg.getLayout = function (url, callback) {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'html',
      success: function (data) {
        callback && typeof callback === 'function' && callback(data);
      },
      error: function () {
        // console.log('error');
        callback && typeof callback === 'function' && callback(false);
      },
    });
  };

  mg.ajax_api = function (path, formdata, callback) {
    var datas = formdata || {};
    $.ajax({
      url: path,
      cache: false,
      dataType: 'json',
      type: 'POST',
      data: datas,
      success: function (res) {
        callback && typeof callback === 'function' && callback(res);
      },
      error: function (res) {
        // console.log(res.msg);
        callback && typeof callback === 'function' && callback(false);
      },
    });
  };

  mg.browser = {
    versions: (function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == ' qq', //是否QQ
        fbapp: u.indexOf('FBAV') > -1, //Facebook App內瀏覽器
        line: u.indexOf('Line') > -1, //Line內瀏覽器
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  };

  global.mg = mg;

  var menu = './component/menu_2.html';
  $(function () {
    // 匯入menu資料
    mg.getLayout(menu, function (res) {
      $('.menu').append(res);
    });

    $('.popup_close, .cancel_submit').on('click', function () {
      $('.popup').fadeOut();
      mg.stopBodyScroll(false);
    });

    $('#menu_toggle').on('click', function () {
      $('.menu').fadeIn();
      mg.stopBodyScroll(true);
    });

    $(document).on('click', '#menu_close', function () {
      $('.menu').fadeOut();
      mg.stopBodyScroll(false);
    });

    $(window).scroll(function () {
      var windowH = $(window).scrollTop();
      windowH > 150 ? $('.srcoll_top').fadeIn() : $('.srcoll_top').fadeOut();
    });

    $('.srcoll_top').on('click', function () {
      $('html,body').animate({ scrollTop: 0 }, 800);
    });
  });
})(window, jQuery);
