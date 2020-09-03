class TestCollectionA extends Backbone.Collection.Lunr
	
	lunroptions: 
		fields: [
			{ name: "title", boost: 10 }
			{ name: "body" }
		]


class TestCollectionB extends Backbone.Collection.Lunr
	
	lunroptions: 
		fields: [
			{ name: "name", boost: 10 }
			{ name: "email" }
			{ name: "tags", boost: 5 }
			{ name: "settings.labels", boost: 20 }
		]


testCollA = null
testCollB = null
describe 'Basics', ->

	it 'init collection', (done)->
		testCollA = new TestCollectionA( _dataA.result )

		expect( testCollA ).be.an( Backbone.Collection.Lunr )

		done()
		return

	it 'search', (done)->
		
		result = testCollA.search( "Eros" ).toJSON()
		#console.log 'RESULT: search', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('title')
		expect(	result[ 0 ].title ).to.contain("Eros")

		done()
		return

	it 'search width space', (done)->
		query = "dolor accumsan";
		result = testCollA.search( query ).toJSON()
		#console.log 'RESULT: search', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)

		done()
		return

	it 'search raw', (done)->
		
		result = testCollA.search( "dignissim", true )
		#console.log 'RESULT: search raw', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('score')
		expect(	result[ 0 ].score ).to.be.a('number')
		done()
		return

	it 'reset the collection', ( done )->

		testCollA.reset( _dataC.result )

		done()
		return

	it 'try to find an old element', ( done )->

		result = testCollA.search( "dignissim" )
		#console.log 'RESULT: try to find an old element', result
		expect( result.toJSON() ).be.an( Array )
		expect( result.toJSON().length ).to.be(0)
		done()
		return		

	it 'try to find an new element', ( done )->

		result = testCollA.search( "Gilmore" ).toJSON()
		#console.log 'RESULT: try to find an new element', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('body')
		expect(	result[ 0 ].body ).to.contain("Gilmore")
		done()
		return	


describe 'Add, change and remove', ->

	it 'add models', (done)->

		testCollA.add [
			{ id: 999, title: "Lunr test", body: "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte." }
			{ id: 998, title: "Pangramm", body: "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern." }
		]

		done()
		return

	it 'search for one added model', (done)->

		result = testCollA.search( "Lunr" ).toJSON()
		#console.log 'RESULT: search for one added model', result
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('title')
		expect(	result[ 0 ].title ).to.contain("Lunr")
		done()
		return

	it 'search for another added model', (done)->

		result = testCollA.search( "Boxer" ).toJSON()
		#console.log 'RESULT: search for another added model', result
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('body')
		expect(	result[ 0 ].body ).to.contain("Boxer")
		done()
		return

	it 'remove a model', (done)->

		testCollA.remove( 999 )
		
		expect( testCollA.get( 999 ) ).to.not.be.ok()

		done()
		return

	it 'change a model', (done)->

		testCollA.get( 998 ).set( title: "Changed" )

		done()
		return

	it 'search for removed model content', (done)->

		result = testCollA.search( "Lunr" ).toJSON()
		#console.log 'search for removed model content', result
		expect( result ).be.an( Array )
		expect( result.length ).to.be(0)
		done()
		return

	it 'search for changed model content', (done)->

		result = testCollA.search( "Changed" ).toJSON()
		#console.log 'search for changed model content', result
		expect( result ).be.an( Array )
		expect(	result[ 0 ] ).to.have.property('body')
		expect(	result[ 0 ].title ).to.contain("Changed")
		expect(	result[ 0 ].id ).to.be( 998 )
		done()
		return

describe 'Tags', ->
	it 'init collection', (done)->
		testCollB = new TestCollectionB( _dataB.result )

		expect( testCollB ).be.an( Backbone.Collection.Lunr )

		done()
		return

	it 'search for a tag', (done)->
		
		result = testCollB.search( "ipsum" ).toJSON()
		#console.log 'RESULT: search for a tag', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('tags')
		expect(	result[ 0 ].tags ).to.contain( "ipsum" )

		done()
		return

	it 'search for a tag with space', (done)->
		
		result = testCollB.search( "ab xy" ).toJSON()
		#console.log 'RESULT: search for a tag', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('tags')
		expect(	result[ 0 ].tags ).to.contain( "ab xy" )

		done()
		return
	
	it 'search for something within sub object', (done)->
		query = "aabbcc"
		result = testCollB.search( query).toJSON()
		#console.log 'RESULT: search for a tag', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).property('settings').property('labels').contain( query )

		done()
		return

	it 'search for a part of a tag', (done)->
		
		result = testCollB.search( "dign" ).toJSON()
		#console.log 'RESULT: search for a part of a tag', result 
		expect( result ).be.an( Array )
		expect( result.length ).to.be.above(0)
		expect(	result[ 0 ] ).to.have.property('tags')
		expect(	result[ 0 ].tags ).to.contain( "dignissim" )

		done()
		return
