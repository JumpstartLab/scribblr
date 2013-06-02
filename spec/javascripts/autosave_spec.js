//= require spec_helper
describe("autosave", function() {
  describe("saveForm", function() {
    var server;
    beforeEach(function() {
      server = sinon.fakeServer.create();
      $("body").html(JST['templates/autosave_form']());
    });

    afterEach(function() {
      server.restore();
    });

    it("should save a form via ajax", function() {
      $("form").autosave("save");
      
      var request = server.requests[0];
      request.url.should.equal("/posts");
      request.requestBody.should.equal("title=My+Post+Title");
      request.respond(204, {}, "");
      $(".page-header").text().should.match(/Post saved/);
    });

    it("should only save if values have changed", function() {
      console.debug("second test");
      $("form").autosave("save");
      console.debug("again!");
      $("form").autosave("save");
      console.debug("check");
      server.requests.length.should.equal(1);

      $("form input").val("A different title");
      $("form").autosave("save");
      server.requests.length.should.equal(2);
    });
  });
});
