class Backbone.Collection.Lunr extends Backbone.Collection

	lunroptions: 
		fields: []

	constructor: ( models, options )->

		super( models, options )
		@_lunrInitialized = false
		@on "add", @_lunrAdd
		@on "remove", @_lunrRemove
		@on "change", @_lunrChange
		return
	
	_lunrInitialize: ( force = false )=>
		# silent exit on second init
		if not force and @_lunrInitialized
			return
			
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
		@_lunrInitialized = true
		return @

	_lunrAdd: ( model )=>
		@_lunrInitialize()
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# add empty strings to index for fields that are not defined in the model or convert it to strings
		for field in @_lunrFields
			if not _model[ field ]?
				_model[ field ] = ""
			else
				_model[ field ] = _model[ field ].toString()
		# add the model to the index
		@_lunrIndex.add( _model )
		return

	_lunrRemove: ( model )=>
		@_lunrInitialize()
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# remove the model from the index
		@_lunrIndex.remove( _model )
		return

	_lunrChange: ( model )=>
		@_lunrInitialize()
		_model = model.toJSON()
		# set the cid as ref
		_model.cid = model.cid
		# add empty strings to index for fields that are not defined in the model or convert it to strings
		for field in @_lunrFields
			if not _model[ field ]?
				_model[ field ] = ""
			else
				_model[ field ] = _model[ field ].toString()
		# update the model in the index
		@_lunrIndex.update( _model )
		return

	reset: ( models, options )=>
		@_lunrInitialize( true )

		super( models, options )

		for model in @models
			@_lunrAdd( model )

		return @

	processTerm: ( term )->
		return term

	search: ( term, raw = false )=>
		# first init if not inited yet
		@_lunrInitialize()
		
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
