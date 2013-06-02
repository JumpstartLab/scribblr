//=require application
//=require_tree ./templates

describe("notification", function() {
  beforeEach(function() {
    $("body").html(JST['templates/page_header']());
  });

  describe("info level", function() {
    beforeEach(function() {
      notify("hello world");
    });

    it("should put a message on the page header", function() {
      $(".page-header").text().should.match(/hello world/);
    });
    
    it("should default to the info level", function() {
      $(".page-header .alert").hasClass("alert-info").should.be.true;
    });
  });

  describe("error level", function() {
    it("should make error messages", function() {
      notify("everything is terrible", "error");
      $(".page-header .alert").hasClass("alert-error").should.be.true;
    });
  });
});
