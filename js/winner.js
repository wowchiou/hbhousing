(function ($) {
  var weekListTemp = '';

  $(function () {
    mg.getLayout('./component/weekTemp.html', function (res) {
      weekListTemp = res;

      mg.ajax_api('actions/getWinner.php', {}, function (res) {
        if (!!res.winner.name) {
          mg.getLayout('./component/winnerTemp.html', function (data) {
            var winnerListTemp = data
              .replace(/rpTitle/g, res.winner.title)
              .replace(/rpName/g, res.winner.name)
              .replace(/rpPhone/g, res.winner.phone);

            $('.part_winner .part_data').append(winnerListTemp);
            $('.winner_part').eq(0).show();
          });
        }

        if (res.week.length > 0) {
          var weekStr = '';
          res.week.forEach(function (item) {
            weekStr += weekListTemp
              .replace(/rpItem/g, item.item)
              .replace(/rpTitle/g, item.title)
              .replace(/rpName/g, item.name)
              .replace(/rpPhone/g, item.phone);
          });

          $('.part_week .part_data').append(weekStr);
          $('.winner_part').eq(1).show();
        }
      });
    });
  });
})(jQuery);
