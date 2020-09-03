/**
 * backlunr - is a solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js
 * @version v0.2.5
 * @link https://github.com/mpneuried/backlunr
 * @license MIT
 */
(function() {
  var ref,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  ref = Backbone.Collection.Lunr = (function() {
    class Lunr extends Backbone.Collection {
      constructor(models, options) {
        super(models, options);
        this._lunrInitialize = this._lunrInitialize.bind(this);
        this._lunrAdd = this._lunrAdd.bind(this);
        this._lunrRemove = this._lunrRemove.bind(this);
        this._lunrChange = this._lunrChange.bind(this);
        this.reset = this.reset.bind(this);
        this._lunrExtractData = this._lunrExtractData.bind(this);
        this.search = this.search.bind(this);
        this._lunrInitialized = false;
        this.on("add", this._lunrAdd);
        this.on("remove", this._lunrRemove);
        this.on("change", this._lunrChange);
        return;
      }

      _lunrInitialize(force = false) {
        var _coll;
        boundMethodCheck(this, ref);
        // silent exit on second init
        if (!force && this._lunrInitialized) {
          return;
        }
        _coll = this;
        _coll._lunrFields = [];
        this._lunrIndex = lunr(function() {
          var _opt, field, i, j, len, len1, mdl, ref1, ref2;
          if (_.isFunction(_coll.lunroptions)) {
            _opt = _coll.lunroptions(opt);
          } else {
            _opt = _.extend({}, _coll.lunroptions || (_coll.lunroptions = {}));
          }
          this.ref("cid");
          ref1 = _opt.fields;
          for (i = 0, len = ref1.length; i < len; i++) {
            field = ref1[i];
            _coll._lunrFields.push(field.name);
            this.field(field.name, _.omit(field, ["isID", "name"]));
          }
          ref2 = _coll.models;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            mdl = ref2[j];
            this.add(_coll._lunrExtractData(mdl));
          }
        });
        this._lunrInitialized = true;
        return this;
      }

      _lunrAdd(model) {
        boundMethodCheck(this, ref);
        this._lunrInitialize();
        // add the model to the index
        this._lunrIndex.add(this._lunrExtractData(model));
      }

      _lunrRemove(model) {
        var _model;
        boundMethodCheck(this, ref);
        this._lunrInitialize();
        _model = model.toJSON();
        // set the cid as ref
        _model.cid = model.cid;
        // remove the model from the index
        this._lunrIndex.remove(_model);
      }

      _lunrChange(model) {
        boundMethodCheck(this, ref);
        this._lunrInitialize();
        
        // update the model in the index
        this._lunrIndex.update(this._lunrExtractData(model));
      }

      reset(models, options) {
        var i, len, model, ref1;
        boundMethodCheck(this, ref);
        super.reset(models, options);
        this._lunrInitialize(true);
        ref1 = this.models;
        for (i = 0, len = ref1.length; i < len; i++) {
          model = ref1[i];
          this._lunrAdd(model);
        }
        return this;
      }

      _lunrExtractData(model) {
        var _model, field, i, len, ref1;
        boundMethodCheck(this, ref);
        _model = model.toJSON();
        // set the cid as ref
        _model.cid = model.cid;
        ref1 = this._lunrFields;
        // add empty strings to index for fields that are not defined in the model or convert it to strings
        for (i = 0, len = ref1.length; i < len; i++) {
          field = ref1[i];
          if (_model[field] == null) {
            _model[field] = "";
          } else {
            if (Array.isArray(_model[field])) {
              _model[field] = _model[field].map((el) => {
                return (el != null ? el.toString() : void 0) || "";
              }).join(" ");
            } else {
              _model[field] = _model[field].toString();
            }
          }
        }
        return _model;
      }

      processTerm(term) {
        return term;
      }

      search(term, raw = false) {
        var _lunrRes, _res, idx, res;
        boundMethodCheck(this, ref);
        // first init if not inited yet
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
            var i, len, ref1, results;
            ref1 = this;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              model = ref1[i];
              results.push(model.toJSON(options));
            }
            return results;
          }).call(this);
          return _json;
        };
        return _res;
      }

    };

    Lunr.prototype.lunroptions = {
      fields: []
    };

    return Lunr;

  }).call(this);

}).call(this);
