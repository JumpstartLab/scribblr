$(function() {
  $("form[data-autosave]").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      type: "POST",
      data: $(this).serialize(),
      dataType: "json"
    }).done(function(data, status, response) {
      notify("Post saved.", "success");
    }).fail(function(data, status, response) {
      notify("Post failed to save.", "error");
    });
  });
});

function notify(message, level) {
  if (level === undefined) level = "info";
  // display a notification under the page header
  $('<div class="alert alert-' + level + '">' + message + '</div>').
    appendTo('.page-header').
    delay(3000).
    fadeOut(500, function() {
      $(this).remove()
    });
}
