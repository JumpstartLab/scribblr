//= require spec_helper
describe("autosave", function() {
  describe("saveForm", function() {
    var server;
    beforeEach(function() {
      server = sinon.fakeServer.create();
      $("body").html(JST['templates/autosave_form']());
      $("form").autosave();
    });

    afterEach(function() {
      server.restore();
    });

    it("should save a form via ajax", function() {
      $("form input").val("A different title");
      $("form").autosave("save");
      
      var request = server.requests[0];
      request.url.should.equal("/posts");
      request.requestBody.should.equal("title=A+different+title");
      request.respond(204, {}, "");
      $(".page-header").text().should.match(/Post saved/);
    });

    it("should only save if values have changed", function() {
      server.requests.length.should.equal(0);

      $("form input").val("A different title");
      $("form").autosave("save");
      server.requests.length.should.equal(1);
    });
  });
});
