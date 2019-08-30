$(document).ready(function() {
  $('.formButton').click(function(event) {
    console.log(event);
    $('#' + event.target.id + '_form').toggle();
  });
});
