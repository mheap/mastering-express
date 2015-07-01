var expect = require("expect.js");
var Instagram = require("../lib/instagram");
var sinon = require("sinon");

var ig = new Instagram("some_id", "some_secret");

ig.get_most_popular = function(callback) {
    return callback(null, {"data":"incoming"}, 3);
};

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function(){
  this.sinon.restore();
});

describe("the credentials", function() {
  it("should return the correct client ID", function(){
    expect(ig.getClientId()).to.be("some_id");
  });

  it("should return the correct client secret", function(){
    expect(ig.getClientSecret()).to.be("some_secret");
  });

  it("should return the correct data from get_most_popular", function(done){
    ig.get_most_popular(function(err, media, limit){
      expect(err).to.be(null);
      expect(media).to.be.an('object');
      expect(media).to.eql({"data":"incoming"});
      expect(limit).to.equal(3);

      done();
    });
  });

  it("should call fetch_from_cache when loading via cache", function(done){
    this.sinon.spy(ig, "fetch_from_cache");

    ig.get_most_popular_with_cache(function(err, media, limit){
      expect(ig.fetch_from_cache.callCount).to.be(1);
      done();
    });
  });

  it("should NOT call fetch_from_cache when loading without cache", function(done){
    this.sinon.spy(ig, "fetch_from_cache");

    ig.get_most_popular(function(err, media, limit){
      expect(ig.fetch_from_cache.callCount).to.be(0);
      done();
    });
  });


});

