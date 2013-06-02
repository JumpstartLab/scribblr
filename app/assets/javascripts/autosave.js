(function($) {
  $.fn.autosave = function(command) {
    this.each(function() {
      var form = this;
      if (!form.autosaving) {
        form.autosaving = true;
        var $form = $(form);
        form.savedForm = $form.serialize();

        $(window).on("unload", function() {
          saveFormIfChanged(false);
        });

        $form.on("submit", function() {
          savedForm = $form.serialize();
        });

        form.saveForm = function(async) {
          if (async === undefined) async = true;

          $.ajax({
            url: $form.attr("action"),
            type: "POST",
            data: $form.serialize(),
            dataType: "json",
            async: async
          }).done(function(data, status, response) {
            notify("Post saved.", "success");
          }).fail(form.formError);
        }

        form.saveFormIfChanged = function(async) {
          var currentForm = $form.serialize();

          if (currentForm !== form.savedForm) {
            form.saveForm($form, async);
            form.savedForm = currentForm;
            return true;
          } else {
            return false;
          }
        }

        form.formError = function() {
          clearInterval(form.autosaveInterval);
          $(window).off("unload");
          $form.off("submit");
        }

        form.autosaveInterval = window.setInterval(form.saveFormIfChanged, 10000);
      }

      if (command === "save") form.saveForm();
    });
  }

  $(function() {
    $("form[data-autosave]").autosave();
  });
}( jQuery ));

