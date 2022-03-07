(function ($) {
  var formData = {};
  var itemSlider = {};
  var typeTempUrl = './component/typeSlideTemp.html';
  var itemTempUrl = './component/itemSlideTemp.html';

  var canvas;
  var stage;
  var update = true;

  var target = '';

  var gameItem2 = [
    { title: '牆壁', type: 1, amount: 8 }, // 牆 1
    { title: '地板', type: 2, amount: 6 }, // 地板 2
    { title: '窗戶', type: 3, amount: 3 }, // 窗戶 3
    { title: '窗簾', type: 4, amount: 3 }, // 窗簾 4

    { title: '地毯', type: 5, amount: 7 }, // 地毯 17
    { title: '沙發', type: 6, amount: 5 }, // 沙發 18
    { title: '抱枕', type: 7, amount: 2 }, // 抱枕 19
    { title: '書櫃', type: 8, amount: 7 }, // 櫃子 20
    { title: '桌椅', type: 9, amount: 3 }, // 桌、椅 21
    { title: '燈扇', type: 10, amount: 5 }, // 燈、扇 22
    { title: '時鐘', type: 11, amount: 3 }, // 時鐘 23
    { title: '電器', type: 13, amount: 3 }, // 電器 24
    { title: '掛畫', type: 12, amount: 4 }, // 畫 25

    { title: '蛋糕', type: 15, amount: 4 }, // 蛋糕 26
    { title: '飲品', type: 16, amount: 4 }, // 飲料 27
    { title: '植物', type: 17, amount: 5 }, // 植物 28

    { title: '裝飾', type: 14, amount: 3 }, // 其他 29

    { title: '頭部', type: 21, amount: 2 }, // 男女頭 5
    { title: '男髮', type: 22, amount: 17 }, // 男髮 6
    { title: '女髮', type: 25, amount: 20 }, // 女髮 10
    { title: '男身', type: 23, amount: 10 }, // 男身 7
    { title: '女身', type: 26, amount: 12 }, // 女身 11
    { title: '男腳', type: 24, amount: 10 }, // 男腳 8
    { title: '女腳', type: 27, amount: 8 }, // 女腳 12
    { title: '眼鏡', type: 28, amount: 7 }, // 眼鏡 13
    { title: '鬍子', type: 29, amount: 6 }, // 鬍子 9

    { title: '小孩', type: 20, amount: 15 }, // 小孩 14
    { title: '狗狗', type: 18, amount: 9 }, // 狗 15
    { title: '貓貓', type: 19, amount: 11 }, // 貓 16
  ];

  $(function () {
    mg.stopBodyScroll(true);

    // 非手機裝置增加class
    if (!mg.detectmobile.isMobile) {
      $('html').addClass('pc');
    }

    // line或fb跳窗提醒
    if (!!mg.browser.versions.line || !!mg.browser.versions.fbapp) {
      alert('建議使用Chrome或safari瀏覽器，以獲得最佳遊戲體驗唷！');
    }

    // 設定type slider
    setTypeSlide();

    // 設定item slider
    setItemSlide();

    // canvas畫布初始設定
    canvas = document.getElementById('canvas_game');
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver();
    stage.preventSelection = false;

    // 地區資料外掛
    $('#twzipcode').twzipcode();

    setStepEvent();
    setGameEvent();
    setPopupEvent();
  });

  function setStepEvent() {
    $('.step1_next').on('click', function (e) {
      e.preventDefault();

      $('.step1').hide();
      $('.step2').show();
    });
    $('.step2_next').on('click', function (e) {
      e.preventDefault();

      $('.step2').hide();
      $('.step3').show();
    });
    $('.step_start').on('click', function (e) {
      e.preventDefault();

      $('.step3').fadeOut();
      mg.stopBodyScroll(false);
    });
  }

  var slideType;
  function setGameEvent() {
    // 項目被點擊時
    $(document).on('click', '.item_slide', function () {
      setActive($(this));

      slideType = $('.game_type .swiper-slide.active').data('type');
      var item = $('.game_item .swiper-slide.active').data('item');

      var url = './images/game/item/' + slideType + '/' + item;

      if (slideType === 1) {
        $('.game_wall').attr('src', url + '.jpg');
      } else if (slideType === 2) {
        $('.game_floor').attr('src', url + '.jpg');
      } else {
        url += '.png';
        putCanvasPic(url);
      }
    });

    // 遊戲物件旋轉/縮放/刪除
    var timer;
    var time = 20;
    $('.rotate_left').on('touchstart mousedown', function (e) {
      e.preventDefault();
      clearInterval(timer);
      timer = setInterval(function () {
        rotateCanvas(3);
      }, time);
    });

    $('.rotate_right').on('touchstart mousedown', function (e) {
      e.preventDefault();
      clearInterval(timer);
      timer = setInterval(function () {
        rotateCanvas(-3);
      }, time);
    });

    $('.big_btn').on('touchstart mousedown', function (e) {
      e.preventDefault();
      clearInterval(timer);
      timer = setInterval(function () {
        ZoomCanvas(0.01);
      }, time);
    });

    $('.small_btn').on('touchstart mousedown', function (e) {
      e.preventDefault();
      clearInterval(timer);
      timer = setInterval(function () {
        ZoomCanvas(-0.01);
      }, time);
    });

    $('.rotate_left,.rotate_right,.big_btn,.small_btn').on(
      'touchend mouseup mouseout',
      function (e) {
        e.preventDefault();
        clearInterval(timer);
      }
    );

    $('.delet_btn').on('click', function () {
      if (target !== '' && !!target) {
        stage.removeChild(target);
        stage.update();
      }
    });

    $('.top_btn').on('click', function () {
      setZindex(stage.getNumChildren() - 1);
    });

    $('.bottom_btn').on('click', function () {
      setZindex(0);
    });

    function rotateCanvas(num) {
      if (target !== '' && !!target) {
        target.rotation += num;
        stage.update(target);
      }
    }

    function ZoomCanvas(num) {
      if (target !== '' && !!target) {
        target.scale += num;
        if (target.scale > 2) target.scale = 2;
        if (target.scale < 0.1) target.scale = 0.1;
        stage.update(target);
      }
    }

    function setZindex(num) {
      if (target !== '' && !!target) {
        stage.setChildIndex(target, num);
        stage.update();
      }
    }
  }

  function setPopupEvent() {
    $('.game_done').on('click', function (e) {
      e.preventDefault();

      $(window).scrollTop(0);
      $('#canvas_logo').show();
      $('#my_pic').empty();
      $('.capture').fadeIn();

      if (!mg.detectmobile.isMobile) {
        $('html,body').css('overflow', 'hidden');
        formData.device = 'pc';
      } else {
        formData.device = 'm';
      }

      if (!!target.isChoose) {
        target.children[0].graphics._fill.style = 'rgba(0,0,0,0)';
        target.children[2].graphics._fill.style = 'rgba(0,0,0,0)';
        stage.update(target);
      }

      renderCanvas(function (res) {
        if (!!res) {
          setActive($(this));
          $('#canvas_logo').hide();
          mg.stopBodyScroll(true);

          var cv = $('.canvasPic')[0];
          var screenshot = Canvas2Image.convertToJPEG(cv);
          formData.photo = screenshot.src;

          if (
            mg.detectmobile.isIPhone ||
            mg.detectmobile.isIPad ||
            mg.browser.versions.trident
          ) {
            $('.canvas_cover').find('img').attr('src', formData.photo);
          }
        }
      });
    });

    $('.popup_close').on('click', hideTip);

    $('.download_btn').on('click', function (e) {
      e.preventDefault();

      if (mg.detectmobile.isIPhone || mg.detectmobile.isIPad) {
        $('.canvas_tip').show().find('img').attr('src', './images/c_41.png');
      } else if (mg.browser.versions.trident) {
        $('.canvas_tip').show().find('img').attr('src', './images/c_42.png');
      } else {
        var cv = $('.canvasPic')[0];
        var w = cv.width;
        var h = cv.height;
        var name = 'hbhousing';
        Canvas2Image.saveAsJPEG(cv, w, h, name);
      }
    });

    $('.again_btn').on('click', function (e) {
      e.preventDefault();

      resetStage();
      hideTip();
      $('.capture').fadeOut();
      mg.stopBodyScroll(false);
    });

    $('.capture_share > .btn').on('click', function (e) {
      e.preventDefault();

      facebookLogin(function (res) {
        if (!!res.fb_id) {
          formData.fb_id = res.fb_id;
          formData.fb_accessToken = res.fb_accessToken;
          formData.fb_name = res.fb_name;

          // 存圖、遊戲記錄
          mg.ajax_api('actions/addGame.php', formData, function (res) {
            if (!!res.result && !res.end) {
              formData.event_id = res.event_id;
              formData.share_img = res.share_img;
              formData.share_img_path = res.share_img_path;

              $('.share').show();
              $('.capture').hide();
            } else {
              alert(res.msg);
            }
          });
        }
      });
    });

    $('.next_btn').on('click', checkFormData);

    $('.share_skip').on('click', function (e) {
      e.preventDefault();

      hideTip();
      $('.share').hide();
      $('.thank').show();
    });

    $('.share_btn').on('click', function (e) {
      e.preventDefault();

      var url =
        window.location.origin +
        '/2019-caricature/fb.php?img=' +
        formData.share_img +
        '&user_name=' +
        formData.fb_name;

      fbShare(url, function (res) {
        if (!!res.error_code) return false;

        if (!!res) {
          // fb分享記錄
          mg.ajax_api('actions/addShare.php', formData, function (data) {
            if (!!data.result) {
              $('.share').hide();
              !!data.form ? $('.thank').show() : $('.info').show();
            }
          });
        } else {
          console.log('no share');
        }
      });
    });

    $('.thank_again').on('click', function (e) {
      e.preventDefault();

      resetStage();
      hideTip();
      $('.thank').fadeOut();
      mg.stopBodyScroll(false);
    });
  }

  function hideTip() {
    $('.canvas_tip').hide();
    $('.canvas_cover').find('img').attr('src', '');
  }

  function resetStage() {
    stage.removeAllChildren();
    stage.update();
    $('.game_wall').attr('src', './images/game/item/1/1.jpg');
    $('.game_floor').attr('src', './images/game/item/2/1.jpg');
  }

  function setActive(el) {
    el.addClass('active').siblings().removeClass('active');
  }

  function setSlider(view, next, prev) {
    return {
      slidesPerView: view,
      spaceBetween: 3,
      navigation: {
        nextEl: next,
        prevEl: prev,
      },
    };
  }

  function setTypeSlide() {
    mg.getLayout(typeTempUrl, function (res) {
      var typeTemp = res;

      gameItem2.forEach(function (item) {
        str = typeTemp
          .replace(/rpType/g, item.type)
          .replace(/rpTitle/g, item.title);
        $('.game_type .swiper-wrapper').append(str);
      });

      $('.game_type .swiper-slide').eq(0).addClass('active');

      var typeSlider = new Swiper(
        '.game_type',
        setSlider(8, '.type_next', '.type_prev')
      );

      $(document).on('click', '.game_type .swiper-slide', function () {
        var type = $(this).data('type');
        resetSlide(itemSlider, type);
        setActive($(this));
      });
    });
  }

  var itemTemp = '';
  function setItemSlide() {
    mg.getLayout(itemTempUrl, function (res) {
      itemTemp = res;

      // 初始化item slider的swiper
      itemSlider = new Swiper(
        '.game_item',
        setSlider(5, '.item_next', '.item_prev')
      );

      // 重新設定item silder項目
      resetSlide(itemSlider);
    });
  }

  function resetSlide(obj, itemType) {
    var type = itemType || 1;

    var objItem = gameItem2.find(function (item) {
      return item.type === type;
    });
    var typeLength = objItem.amount;

    // 移除item slider裡原有的所有項目
    obj.removeAllSlides();

    // 將新的item項目一個一個放入item slider
    for (var i = 1; i <= typeLength; i++) {
      var str = itemTemp.replace(/rpItem/g, i).replace(/rpType/g, type);
      obj.appendSlide(str);
    }

    obj.update();
  }

  var bitmapIndex = 1;
  function putCanvasPic(url) {
    var img = new Image();
    img.src = url;
    img.onload = handleImageLoad;
  }

  function handleImageLoad() {
    var image = event.target;

    var container = new createjs.Container();

    // 繪製item圖片
    var bitmap = new createjs.Bitmap(image);
    bitmap.x = 10;
    bitmap.y = 10;
    bitmap.regX = 0;
    bitmap.regY = 0;
    bitmap.rotation = 360 | 0;
    bitmap.scale = bitmap.originalScale = 0.5;
    bitmap.name = 'bmp_' + bitmapIndex;
    bitmap.cursor = 'move';
    bitmapIndex++;

    var imageW = bitmap.image.width / 2;
    var imageH = bitmap.image.height / 2;

    var totalW = imageW + 20;
    var totalH = imageH + 20;

    // 繪製item背景
    var graphics = new createjs.Graphics()
      .beginFill('rgba(0,0,0,0)')
      .drawRect(0, 0, totalW, totalH);
    var shape = new createjs.Shape(graphics);

    // 繪製三角形
    var w = stage.canvas.width / 30;
    var polygon = new createjs.Shape();
    drawPolygon(polygon, 'rgba(0,0,0,0)', totalW, totalH, w);

    if (!!mg.detectmobile.isMobile) {
      // 繪製手機版感應區
      var polygonM = new createjs.Shape();
      drawPolygon(polygonM, 'rgba(0,0,0,0)', totalW, totalH, w * 4);

      container.addChild(shape, bitmap, polygon, polygonM);

      polygonM.on('mousedown', getPageX);
      polygonM.on('pressmove', resizePic);
    } else {
      // 將繪製的東西放入容器
      container.addChild(shape, bitmap, polygon);
    }

    // 將容器放入畫布
    stage.addChild(container);

    container.x = (canvas.width / 2) | 0; // 設定左右置中
    container.y = (canvas.height / 2) | 0; // 設定上下置中
    container.regX = (imageW / 2) | 0; // 設定左右偏移
    container.regY = (imageH / 2) | 0; // 設定上下偏移

    // 自訂container變數
    container.isChoose = false;

    container.on('mousedown', function (evt) {
      this.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };

      if (!this.isChoose) {
        showShap(container);
      } else if (!!this.isChoose) {
        hideShap(target);
      }

      this.isChoose = !this.isChoose;

      if (target !== '' && target !== this) {
        target.isChoose = false;
        hideShap(target);
      }

      target = this;
      update = true;
    });

    bitmap.on('pressmove', function (evt) {
      container.x = evt.stageX + container.offset.x;
      container.y = evt.stageY + container.offset.y;

      showShap(container);

      container.isChoose = true;
      update = true;
    });

    function showShap(obj) {
      obj.children[0].graphics._fill.style = 'rgba(0,0,0,0.1)';
      obj.children[2].graphics._fill.style = '#44a638';
      if (!!mg.detectmobile.isMobile) {
        obj.children[3].graphics._fill.style = 'rgba(255,255,255,0.05)';
      }
    }

    function hideShap(obj) {
      obj.children[0].graphics._fill.style = 'rgba(0,0,0,0)';
      obj.children[2].graphics._fill.style = 'rgba(0,0,0,0)';
      if (!!mg.detectmobile.isMobile) {
        obj.children[3].graphics._fill.style = 'rgba(0,0,0,0)';
      }
    }

    polygon.on('mousedown', getPageX);
    polygon.on('pressmove', resizePic);

    var oPageX = '';
    function getPageX() {
      var e;
      mg.detectmobile.isMobile
        ? (e = window.event.changedTouches[0])
        : (e = window.event);

      oPageX = e.pageX;
    }

    function resizePic() {
      var e;
      mg.detectmobile.isMobile
        ? (e = window.event.changedTouches[0])
        : (e = window.event);

      showShap(container);
      container.isChoose = true;

      if (e.pageX > oPageX) {
        container.scale += (e.pageX - oPageX) / 100;
        if (container.scale > 2) container.scale = 2;
      } else if (e.pageX < oPageX) {
        container.scale -= (oPageX - e.pageX) / 100;
        if (container.scale < 0.1) container.scale = 0.1;
      }

      oPageX = e.pageX;
      update = true;
    }

    createjs.Ticker.addEventListener('tick', tick);
    stage.update();
  }

  function tick(event) {
    if (update) {
      update = false;
      stage.update(event);
    }
  }

  function drawPolygon(shap, color, imgWidth, imgHeight, length) {
    shap.graphics.beginFill(color);
    shap.graphics
      // 右上
      .moveTo(imgWidth, 0)
      .lineTo(imgWidth, length)
      .lineTo(imgWidth - length, 0)
      .lineTo(imgWidth, 0)
      // 右下
      .moveTo(imgWidth, imgHeight)
      .lineTo(imgWidth, imgHeight - length)
      .lineTo(imgWidth - length, imgHeight)
      .lineTo(imgWidth, imgHeight)
      // 左上
      .moveTo(0, 0)
      .lineTo(0, length)
      .lineTo(length, 0)
      .lineTo(0, 0)
      // 左下
      .moveTo(0, imgHeight)
      .lineTo(0, imgHeight - length)
      .lineTo(length, imgHeight)
      .lineTo(0, imgHeight);
    shap.cursor = 'w-resize';
  }

  function renderCanvas(callback) {
    var $myDiv = document.getElementById('game_canvas');

    html2canvas($myDiv, {
      logging: false,
      allowTaint: true,
    }).then(function (canvas) {
      var $cover = $('#my_pic');
      $cover.empty().append(canvas).find('canvas').addClass('canvasPic');

      callback(true);
    });
  }

  var returnvalue;
  function checkFormData() {
    returnvalue = true;
    errormsg = '';

    // 姓名驗證
    if ($('#name').val() == '') {
      errormsg += '請填寫姓名\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#name').focus();
      return false;
    }
    var name = $('#name').val().trim();
    var nameRegxp = /^[\u4e00-\u9fa5]+$/i;
    if (nameRegxp.test(name) != true) {
      errormsg += '請填寫中文姓名\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#name').focus();
      return false;
    }

    // 手機驗證
    if ($('#phone').val() == '') {
      errormsg += '請填寫手機\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#phone').focus();
      return false;
    }
    returnvalue = true;
    errormsg = '';
    var number = $('#phone').val();
    //格式需為09XXXXXXXX
    var numberRegxp = /^09[0-9]{2}[0-9]{6}$/;
    if (numberRegxp.test(number) != true) {
      errormsg += '手機格式錯誤\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#phone').focus();
      return false;
    }

    // mail驗證
    if ($('#email').val() == '') {
      errormsg += '請輸入電子信箱\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#email').focus();
      return false;
    }
    var email = $('#email').val();
    var emailRegxp =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
    if (emailRegxp.test(email) != true) {
      errormsg += '電子信箱格式錯誤\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#email').focus();
      return false;
    }

    // 地址縣市驗證
    if (!$('select[name=city]').val()) {
      errormsg += '請選擇縣市\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('select[name=city]').focus();
      return false;
    }

    // 地址地區驗證
    if (!$('select[name=area]').val()) {
      errormsg += '請選擇地區\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('select[name=area]').focus();
      return false;
    }

    // 地址驗證
    if (!$('#address').val()) {
      errormsg += '請輸入地址\n';
      returnvalue = false;
    }
    if (returnvalue == false) {
      alert(errormsg);
      $('#address').focus();
      return false;
    }

    if (returnvalue == true) {
      formData.name = $('#name').val();
      formData.phone = $('#phone').val();
      formData.email = $('#email').val();
      formData.city = $('select[name=city]').val();
      formData.area = $('select[name=area]').val();
      formData.zip = $('input[name=zip]').val();
      formData.address = $('#address').val();

      // 傳送表單資料
      mg.ajax_api('actions/addUser.php', formData, function (res) {
        if (!!res.result && !res.end) {
          $('input[name="reset"]').click();
          $('.info').hide();
          $('.thank').show();
        }
      });
    } else {
      return false;
    }
  }
})(jQuery);
