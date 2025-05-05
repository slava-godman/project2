$(document).ready(function () {
    $('#loginButton').on('click', function () {
      const email = $('#form2Example1').val();
      const password = $('#form2Example2').val();
  
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
  
      // Get users
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Check for matching user
      const validUser = users.find(user => user.email === email && user.password === password);
  
      if (validUser) {
        // User found -> proceed to login animation
        $(this).hide();
        $('#progressWrapper').show();
  
        let progress = 0;
        const interval = setInterval(function () {
          progress += 1;
          $('#progressBar').css('width', progress + '%').text(progress + '%');
  
          if (progress >= 100) {
            clearInterval(interval);
            window.location.href = "home.html";
          }
        }, 70);
      } else {
        // User not found
        alert('Invalid email or password.');
      }
    });
  });
  