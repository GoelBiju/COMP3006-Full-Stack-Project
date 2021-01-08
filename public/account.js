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
          if (response.login && response.login) {
            let message = `${response.message}, re-directing...`;
            $("#register-alert").html(message);
            $("#register-alert").addClass("alert-success");
            $("#register-alert").addClass("show");

            // Re-direct to home.
            window.location = response.redirectUrl;
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
            $("#register-alert").addClass("alert-success");

            let message = `${response.message}, go back to <a href="/login">login page</a>.`;
            $("#register-alert").html(message);
            $("#register-alert").addClass("show");
          } else {
            $("#register-alert").addClass("alert-danger");

            let message = response.message;
            $("#register-alert").html(message);
            $("#register-alert").addClass("show");
          }
        }
      }
    );
  });
});
