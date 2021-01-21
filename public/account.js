$(function () {
  $("#login-btn").click(function () {
    $.post(
      "/api/login",
      {
        username: $("#username").val(),
        password: $("#password").val(),
      },
      function (response, status) {
        $("#login-alert").addClass("close");
        console.log(response);
        if (status == "success") {
          if (response.login) {
            let message = `${response.message}, re-directing...`;
            $("#login-alert").html(message);
            $("#login-alert").removeClass("alert-danger");
            $("#login-alert").addClass("alert-success");
            $("#login-alert").addClass("show");

            console.log("Login response: ", response);
            setTimeout(() => {
              window.location = response.redirectUrl;
            }, 1000);
          } else {
            $("#login-alert").html(`Login error: ${response.message}`);
            $("#login-alert").removeClass("alert-success");
            $("#login-alert").addClass("alert-danger");
            $("#login-alert").addClass("show");
          }
        }
      }
    );
  });

  $("#register-btn").click(function () {
    // Check passwords match, minimum length
    let password = $("#password").val();
    let confirmPassword = $("#confirmPassword").val();

    if (password === confirmPassword) {
      if (password.length >= 5) {
        // Send registration details
        $.post(
          "/api/register",
          {
            username: $("#username").val(),
            password: $("#password").val(),
          },
          function (response, status) {
            $("#register-alert").addClass("close");
            console.log(response);
            if (status == "success") {
              if (response.registered) {
                let message = `${response.message}, go back to <a href="/login">login page</a>.`;
                $("#register-alert").html(message);
                $("#register-alert").removeClass("alert-danger");
                $("#register-alert").addClass("alert-success");
                $("#register-alert").addClass("show");
              } else {
                let message = response.message;
                $("#register-alert").html(message);
                $("#register-alert").removeClass("alert-success");
                $("#register-alert").addClass("alert-danger");
                $("#register-alert").addClass("show");
              }
            }
          }
        );
      } else {
        $("#register-alert").addClass("close");
        $("#register-alert").html(
          "Please enter a password with a minimum of 5 characters."
        );
        $("#register-alert").removeClass("alert-success");
        $("#register-alert").addClass("alert-danger");
        $("#register-alert").addClass("show");
      }
    } else {
      $("#register-alert").addClass("close");
      $("#register-alert").html(
        "The password you entered and the password confirmation do not match."
      );
      $("#register-alert").removeClass("alert-success");
      $("#register-alert").addClass("alert-danger");
      $("#register-alert").addClass("show");
    }
  });
});
