/**
 * backlunr - is a solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js
 * @version v0.2.5
 * @link https://github.com/mpneuried/backlunr
 * @license MIT
 */
(function() {
  var TestCollectionA, TestCollectionB, testCollA, testCollB,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TestCollectionA = (function(superClass) {
    extend(TestCollectionA, superClass);

    function TestCollectionA() {
      return TestCollectionA.__super__.constructor.apply(this, arguments);
    }

    TestCollectionA.prototype.lunroptions = {
      fields: [
        {
          name: "title",
          boost: 10
        }, {
          name: "body"
        }
      ]
    };

    return TestCollectionA;

  })(Backbone.Collection.Lunr);

  TestCollectionB = (function(superClass) {
    extend(TestCollectionB, superClass);

    function TestCollectionB() {
      return TestCollectionB.__super__.constructor.apply(this, arguments);
    }

    TestCollectionB.prototype.lunroptions = {
      fields: [
        {
          name: "name",
          boost: 10
        }, {
          name: "email"
        }, {
          name: "tags",
          boost: 5
        }, {
          name: "settings.labels",
          boost: 20
        }
      ]
    };

    return TestCollectionB;

  })(Backbone.Collection.Lunr);

  testCollA = null;

  testCollB = null;

  describe('Basics', function() {
    it('init collection', function(done) {
      testCollA = new TestCollectionA(_dataA.result);
      expect(testCollA).be.an(Backbone.Collection.Lunr);
      done();
    });
    it('search', function(done) {
      var result;
      result = testCollA.search("Eros").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('title');
      expect(result[0].title).to.contain("Eros");
      done();
    });
    it('search width space', function(done) {
      var query, result;
      query = "dolor accumsan";
      result = testCollA.search(query).toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      done();
    });
    it('search raw', function(done) {
      var result;
      result = testCollA.search("dignissim", true);
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('score');
      expect(result[0].score).to.be.a('number');
      done();
    });
    it('reset the collection', function(done) {
      testCollA.reset(_dataC.result);
      done();
    });
    it('try to find an old element', function(done) {
      var result;
      result = testCollA.search("dignissim");
      expect(result.toJSON()).be.an(Array);
      expect(result.toJSON().length).to.be(0);
      done();
    });
    return it('try to find an new element', function(done) {
      var result;
      result = testCollA.search("Gilmore").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('body');
      expect(result[0].body).to.contain("Gilmore");
      done();
    });
  });

  describe('Add, change and remove', function() {
    it('add models', function(done) {
      testCollA.add([
        {
          id: 999,
          title: "Lunr test",
          body: "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte."
        }, {
          id: 998,
          title: "Pangramm",
          body: "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern."
        }
      ]);
      done();
    });
    it('search for one added model', function(done) {
      var result;
      result = testCollA.search("Lunr").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('title');
      expect(result[0].title).to.contain("Lunr");
      done();
    });
    it('search for another added model', function(done) {
      var result;
      result = testCollA.search("Boxer").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('body');
      expect(result[0].body).to.contain("Boxer");
      done();
    });
    it('remove a model', function(done) {
      testCollA.remove(999);
      expect(testCollA.get(999)).to.not.be.ok();
      done();
    });
    it('change a model', function(done) {
      testCollA.get(998).set({
        title: "Changed"
      });
      done();
    });
    it('search for removed model content', function(done) {
      var result;
      result = testCollA.search("Lunr").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be(0);
      done();
    });
    return it('search for changed model content', function(done) {
      var result;
      result = testCollA.search("Changed").toJSON();
      expect(result).be.an(Array);
      expect(result[0]).to.have.property('body');
      expect(result[0].title).to.contain("Changed");
      expect(result[0].id).to.be(998);
      done();
    });
  });

  describe('Tags', function() {
    it('init collection', function(done) {
      testCollB = new TestCollectionB(_dataB.result);
      expect(testCollB).be.an(Backbone.Collection.Lunr);
      done();
    });
    it('search for a tag', function(done) {
      var result;
      result = testCollB.search("ipsum").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('tags');
      expect(result[0].tags).to.contain("ipsum");
      done();
    });
    it('search for a tag with space', function(done) {
      var result;
      result = testCollB.search("ab xy").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('tags');
      expect(result[0].tags).to.contain("ab xy");
      done();
    });
    it('search for something within sub object', function(done) {
      var query, result;
      query = "aabbcc";
      result = testCollB.search(query).toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).property('settings').property('labels').contain(query);
      done();
    });
    return it('search for a part of a tag', function(done) {
      var result;
      result = testCollB.search("dign").toJSON();
      expect(result).be.an(Array);
      expect(result.length).to.be.above(0);
      expect(result[0]).to.have.property('tags');
      expect(result[0].tags).to.contain("dignissim");
      done();
    });
  });

}).call(this);
