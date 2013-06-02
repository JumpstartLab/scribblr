(function($) {
  var AutosaveForm = function(form) {
    var $form = $(form);
    this.savedForm = $form.serialize();

    this.form = form;
    this.$form = $form;

    var autosaveForm = this;
    $(window).on("unload", function() {
      autosaveForm.saveFormIfChanged(false);
    });

    $form.on("submit", function() {
      autosaveForm.savedForm = $form.serialize();
    });

    this.autosaveInterval = window.setInterval(function() {
      autosaveForm.saveFormIfChanged()
    }, 10000);
  };

  AutosaveForm.prototype = {
    saveForm: function(async) {
      if (async === undefined) async = true;
      var autosaveForm = this;

      $.ajax({
        url: this.$form.attr("action"),
        type: "POST",
        data: this.$form.serialize(),
        dataType: "json",
        async: async
      }).done(function(data, status, response) {
        notify("Post saved.", "success");
      }).fail(function() {
        autosaveForm.formError()
      });
    },

    saveFormIfChanged: function(async) {
      var currentForm = this.$form.serialize();

      if (currentForm !== this.savedForm) {
        this.saveForm(this.$form, async);
        this.savedForm = currentForm;
        return true;
      } else {
        return false;
      }
    },

    formError: function() {
      clearInterval(this.autosaveInterval);
      $(window).off("unload");
      this.$form.off("submit");
    }
  };


  $.fn.autosave = function(command) {
    this.each(function() {
      var form = this;
      if (!form.autosave) {
        form.autosave = new AutosaveForm(form);
      }
      if (command === "save") form.autosave.saveFormIfChanged();
    });
  }

  $(function() {
    $("form[data-autosave]").autosave();
  });
}( jQuery ));

