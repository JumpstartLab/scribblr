$(function() {
  var $form = $("form[data-autosave]");
  var savedForm = $form.serialize();
  var autosaveInterval = window.setInterval(saveFormIfChanged, 10000);

  $(window).on("unload", function() {
    saveFormIfChanged(false);
  });

  $form.on("submit", function() {
    savedForm = $(this).serialize();
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

  function saveForm(async) {
    if (async === undefined) async = true;

    $.ajax({
      url: $form.attr("action"),
      type: "POST",
      data: $form.serialize(),
      dataType: "json",
      async: async
    }).done(function(data, status, response) {
      notify("Post saved.", "success");
    }).fail(formError);
  }

  function saveFormIfChanged(async) {
    var currentForm = $form.serialize();

    if (currentForm !== savedForm) {
      saveForm(async);
      savedForm = currentForm;
      return true;
    } else {
      return false;
    }
  }

  function formError() {
    clearInterval(autosaveInterval);
    $(window).off("unload");
    $form.off("submit");
  }
});

