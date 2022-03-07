(function (window, $) {
  $(function () {
    mg.setScroller('.p4_content');
    setButton();
  });

  function setButton() {
    $('.type_item').on('click', function () {
      var tag = $(this).data('tag');
      var h = $(tag).offset().top;
      $('html,body').animate({ scrollTop: h }, 800);
    });

    $('.ab_go3').on('click', function () {
      $('.login').fadeIn();
      mg.stopBodyScroll(true);
    });
  }
})(window, jQuery);
