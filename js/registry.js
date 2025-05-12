$(document).ready(function () {
    $('#registerButton').on('click', function () {
      const username = $('#form3Example1c').val().trim();
      const email = $('#form3Example3c').val().trim();
      const password = $('#form3Example4c').val().trim();
  
      if (!email || !password||!username) {
        alert('Please fill in all fields.');
        return;
      }
  
      // Get existing users from localStorage
      let users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Check if user already exists
      const userExists = users.some(user =>user.username===username ||user.email === email);
      if (userExists) {
        alert('User already exists.');
        return;
      }
  
      // Add new user
      users.push({username:username, email: email, password: password });
  
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
  
      alert('Registration successful!');
      // Redirect to login page
      window.location.href = "./login.html";
    });
  });
  