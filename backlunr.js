/**
 * backlunr - is a solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js
 * @version v0.2.3
 * @link https://github.com/mpneuried/backlunr
 * @license MIT
 */
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Backbone.Collection.Lunr = (function(superClass) {
    extend(Lunr, superClass);

    Lunr.prototype.lunroptions = {
      fields: []
    };

    function Lunr(models, options) {
      this.search = bind(this.search, this);
      this.reset = bind(this.reset, this);
      this._lunrChange = bind(this._lunrChange, this);
      this._lunrRemove = bind(this._lunrRemove, this);
      this._lunrAdd = bind(this._lunrAdd, this);
      this._lunrInitialize = bind(this._lunrInitialize, this);
      Lunr.__super__.constructor.call(this, models, options);
      this._lunrInitialized = false;
      this.on("add", this._lunrAdd);
      this.on("remove", this._lunrRemove);
      this.on("change", this._lunrChange);
      return;
    }

    Lunr.prototype._lunrInitialize = function(force) {
      var _coll;
      if (force == null) {
        force = false;
      }
      if (!force && this._lunrInitialized) {
        return;
      }
      _coll = this;
      _coll._lunrFields = [];
      this._lunrIndex = lunr(function() {
        var _opt, field, i, len, ref;
        if (_.isFunction(_coll.lunroptions)) {
          _opt = _coll.lunroptions(opt);
        } else {
          _opt = _.extend({}, _coll.lunroptions || (_coll.lunroptions = {}));
        }
        this.ref("cid");
        ref = _opt.fields;
        for (i = 0, len = ref.length; i < len; i++) {
          field = ref[i];
          _coll._lunrFields.push(field.name);
          this.field(field.name, _.omit(field, ["isID", "name"]));
        }
      });
      this._lunrInitialized = true;
      return this;
    };

    Lunr.prototype._lunrAdd = function(model) {
      var _model, field, i, len, ref;
      this._lunrInitialize();
      _model = model.toJSON();
      _model.cid = model.cid;
      ref = this._lunrFields;
      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        if (_model[field] == null) {
          _model[field] = "";
        } else {
          _model[field] = _model[field].toString();
        }
      }
      this._lunrIndex.add(_model);
    };

    Lunr.prototype._lunrRemove = function(model) {
      var _model;
      this._lunrInitialize();
      _model = model.toJSON();
      _model.cid = model.cid;
      this._lunrIndex.remove(_model);
    };

    Lunr.prototype._lunrChange = function(model) {
      var _model, field, i, len, ref;
      this._lunrInitialize();
      _model = model.toJSON();
      _model.cid = model.cid;
      ref = this._lunrFields;
      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        if (_model[field] == null) {
          _model[field] = "";
        } else {
          _model[field] = _model[field].toString();
        }
      }
      this._lunrIndex.update(_model);
    };

    Lunr.prototype.reset = function(models, options) {
      var i, len, model, ref;
      this._lunrInitialize(true);
      Lunr.__super__.reset.call(this, models, options);
      ref = this.models;
      for (i = 0, len = ref.length; i < len; i++) {
        model = ref[i];
        this._lunrAdd(model);
      }
      return this;
    };

    Lunr.prototype.processTerm = function(term) {
      return term;
    };

    Lunr.prototype.search = function(term, raw) {
      var _lunrRes, _res, idx, res;
      if (raw == null) {
        raw = false;
      }
      this._lunrInitialize();
      _lunrRes = this._lunrIndex.search(this.processTerm(term));
      if (raw) {
        return _lunrRes;
      }
      _res = (function() {
        var i, len, results;
        results = [];
        for (idx = i = 0, len = _lunrRes.length; i < len; idx = ++i) {
          res = _lunrRes[idx];
          results.push(this.get(res.ref));
        }
        return results;
      }).call(this);
      _res.toJSON = function(options) {
        var _json, model;
        _json = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = this.length; i < len; i++) {
            model = this[i];
            results.push(model.toJSON(options));
          }
          return results;
        }).call(this);
        return _json;
      };
      return _res;
    };

    return Lunr;

  })(Backbone.Collection);

}).call(this);
