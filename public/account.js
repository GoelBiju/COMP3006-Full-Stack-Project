$(function () {
  $("#register-btn").click(function () {
    // Check passwords match, minimum length

    // Send registration details
    $.post(
      "/api/register",
      {
        username: $("#username").val(),
        emailAddress: $("#emailAddress").val(),
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
            $("#register-alert").html(response.message);
            $("#register-alert").addClass("alert-danger");
            $("#register-alert").addClass("show");
          }
        }
      }
    );
  });
});
