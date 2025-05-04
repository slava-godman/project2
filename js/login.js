$(document).ready(function () {
    $('#loginButton').on('click', function () {
      // Hide the button
      $(this).hide();
  
      // Show the progress bar
      $('#progressWrapper').show();
  
      // Animate progress bar
      let progress = 0;
      const interval = setInterval(function () {
        progress += 1;
        $('#progressBar').css('width', progress + '%').text(progress + '%');
  
        if (progress >= 100) {
          clearInterval(interval);
          window.location.href = "home.html";
        }
      }, 20);
    });
  });
  