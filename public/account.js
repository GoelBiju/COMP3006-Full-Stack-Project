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
            let message = `${response.message}, re-directing to homepage`;
            $("#register-alert").html(message);
            $("#register-alert").addClass("alert-success");
            $("#register-alert").addClass("show");

            // Save token to localStorage
            localStorage.setItem("token", response.token);

            // Re-direct to home page
          } else {
            $("#register-alert").html(response.message);
            $("#register-alert").addClass("alert-danger");
            $("#register-alert").addClass("show");
          }
        }
      }
    );
  });

  $("#register-btn").click(function () {
    // Check passwords match, minimum length

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
            $("#register-alert").addClass("alert-success");
            $("#register-alert").addClass("show");
          } else {
            let message =
              response.message + ": this username may already be in use.";
            $("#register-alert").html(message);
            $("#register-alert").addClass("alert-danger");
            $("#register-alert").addClass("show");
          }
        }
      }
    );
  });
});
