class Backbone.Collection.Lunr extends Backbone.Collection

	lunroptions: 
		fields: []

	constructor: ( models, options )->

		super( models, options )

		@on "add", @_lunrAdd
		@on "remove", @_lunrRemove
		@on "change", @_lunrChange
		return

	_lunrInitialize: =>
		_coll = @
		_coll._lunrFields = []
		@_lunrIndex = lunr ->
			if _.isFunction( _coll.lunroptions )
				_opt = _coll.lunroptions( opt )
			else
				_opt = _.extend( {}, _coll.lunroptions or= {} )

			@ref( "cid" )
			for field in _opt.fields
				_coll._lunrFields.push( field.name )
				@field( field.name, _.omit( field, [ "isID", "name" ] ) )

			return

	_lunrAdd: ( model )=>
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# add empty strings to index for fields that are not defined in the model
		_model[ field ] = "" for field in @_lunrFields when not _model[ field ]?
		# add the model to the index
		@_lunrIndex.add( _model )
		return

	_lunrRemove: ( model )=>
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# remove the model from the index
		@_lunrIndex.remove( _model )
		return

	_lunrChange: ( model )=>
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# add empty strings to index for fields that are not defined in the model
		_model[ field ] = "" for field in @_lunrFields when not _model[ field ]?
		# update the model in the index
		@_lunrIndex.update( _model )
		return

	reset: ( models, options )=>
		@_lunrInitialize()

		super( models, options )

		for model in @models
			@_lunrAdd( model )

		return @

	processTerm: ( term )=>
		return term

	search: ( term, raw = false )=>
		_lunrRes = @_lunrIndex.search( @processTerm( term ) )
		if raw
			return _lunrRes

		_res = for res, idx in _lunrRes
			@get( res.ref )

		_res.toJSON = ( options )->
			_json = for model in @
				model.toJSON( options )
			return _json

		return _res

