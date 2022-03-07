window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-32646212-11');

$(function () {
  $(document).on('click', '[megais_ga]', function () {
    var trackStr = $(this).attr('megais_ga');
    window.trackingEvent(trackStr, 'click');
  });
});

window.trackingEvent = function (_trackpage, _action) {
  gtag('event', _action, {
    event_category: _trackpage,
    event_label: 'Google',
  });
};
