
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

