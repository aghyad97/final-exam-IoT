

$(function () {
  
  $.ajax({
    url: '/getJokes',
    success: function (data) {
      $('.jokes').prepend('<div class="fancy">' + data + '</div>');
    },
  });


  setInterval(() => {
    $.ajax({
      url: '/getJokes',
      success: function (data) {
        $('.jokes').prepend('<div class="fancy">' + data + '</div>');
      },
    });
  }, 1000 * 60 * 5);

  $('#avgNumber').click(function (event) {
    $('.number-of-chars').empty();
    event.preventDefault();
    console.log($('#form').serialize());
    $.ajax({
      url: '/getAvgNumber',
      type: 'GET',
      data: $('#form').serialize(),
      success: function (data) {
        console.log(data);
        $('.number-of-chars').append('<p>' + data + '</p>');
      },
    });
  })
})