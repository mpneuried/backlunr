backlunr
===========

is a solution to bring [Backbone Collections](http://documentcloud.github.com/backbone/#Collection) together with the browser fulltext search engine [Lunr.js](http://lunrjs.com/).

**INFO: all examples are written in coffee-script**

## Install

To use **backlunr** you first have to load the dependencies:
- [Underscore](http://documentcloud.github.com/underscore) 
- [Backbone](http://documentcloud.github.com/backbone) 
- [Lunr.js](http://lunrjs.com/)

Then add the `backlunr.js` script to your page.

## Usage

### Config

To use the `lunr.js` fulltext search within a collection you have to load `backlunr.js` and use `Backbone.Collection.Lunr` instead of `Backbone.Collection`

The only thing you have to define are the fields to index.

**Config Example:**

```coffee
class User extends Backbone.Model

class Users extends Backbone.Collection.Lunr
	model: User
	lunroptions: 
		fields: [
			{ name: "firstname", boost: 10 }
			{ name: "lastname", boost: 5 }
			{ name: "email" }
			{ name: "address" }
		]
```

#### lunroptions

* `fields` ( Array | Function ): An array of field definitions or a method called on init/reset which has to return the field definitions array
* `fields[ n ]` ( Object ): The field definition
* `fields[ n ].name` ( String - required ): The field name within your model attribute
* `fields[ n ].boost` ( Number - optional: default=1 ): A boost factor for results in this field.

**Attension:** Currently Lunr.js does not support an indexing of numeric values. To use numeric values **backlunr** converts all fields to strings.

### search

To search within your collection you just have to call `.search( "[ term ]" )`.

**Search Example:**

```coffee
# add some users
usersCollection = new Users [
	firstname: "Fritz", lastname: "Maier", "email": "fmaier@maier.com", "address": "Teststreet 123"
, 
	firstname: "Hans", lastname: "Schubert", "email": "hschubert@maier.com", "address": "Checkway 987"
]

result = usersCollection.search( "Fritz" )
# [ User( Fritz ) ]
# returns an array of matching models sorted by the result scoring

result.toJSON()
# [ {firstname: "Fritz", lastname: "Maier", "email": "fmaier@maier.com", "address": "Teststreet 123"} ]
# the single special method `toJSON` of the array returns all models converted by `model.toJSON()`.
```

### Methods

#### Collection.search( term [, raw ] )

`.search()` is the only method added to the collection by **Backlunr**.

**arguments:**

* `term` ( String - required ): the search term
* `raw` ( Boolean - optional: default=false ): Return the raw lunr result including the `score` and models `cid` as `ref`

**retuns ( Array ):**

An array of matching models.  
If you define `raw=true` you will receive an array with object like `{ score: 0.789, ref: "c123" }`

* `toJSON()` If `raw=false` you can use the special `toJSON` method to transform the aray of models to an array of model attributes.

## Ideas

* Create a solution to search in multiple collections by hooking them to a global search module. If a search has been done the result will return all matching models in al hooked collection including the type ( Collection name )

## Work in progress

`backlunr` is work in progress. Your ideas, suggestions etc. are very welcome.

## Development

If you want to contribute you have to install the dependencies and gulp as task runner:

```sh
$ npm install
$ npm install -g gulp
```

After that it's possible to build the code using

```sh
$ gulp
```

## Changelog

#### `0.2.4`

* Readme typo fix [#2](https://github.com/mpneuried/backlunr/pull/2). Thanks to [Cody Nguyen](https://github.com/codynguyen)
* restructured code
* Updated test to Lunr.js `v0.6.0`, jquery `v2.1.4`, backbone `v1.2.3`, mocha `v2.3.4` and expect `v0.3.1`. **Backlunr test already working fine*

#### `0.2.3`

* Fixed Issue #1 to init the collection on search if nor reset has been fired
* Added gulp compile
* Updated test to Lunr.js `v0.5.8`, jquery `v2.1.3`, mocha `v1.21.5` and expect `v0.3.1`. **Backlunr test already working fine*

#### `0.2.2`

* Updated test to Lunr.js `v0.5.3`, jquery `v2.1.1`, mocha `v1.19.0` and expect `v0.3.1`. **Backlunr test already working fine**

#### `0.2.1`

* Updated test to Lunr.js `v0.4.0`, jquery `v2.0.3`, mocha `v1.12.0` and expect `v0.2.0`. **Backlunr test already working fine** but 15% faster.
* Compiled scripts with new coffee version `v1.6.3`

#### `0.2.0`

* Added minified version
* Added support for numeric values by converting every field-value to a string

#### `0.1.0`

* Initial version

## Todo

- restructure to use it standalone or with browserify, AMD, ...

## Other projects

|Name|Description|
|:--|:--|
|[**node-cache**](https://github.com/tcs-de/nodecache)|Simple and fast NodeJS internal caching. Node internal in memory cache like memcached.|
|[**rsmq**](https://github.com/smrchy/rsmq)|A really simple message queue based on redis|
|[**redis-heartbeat**](https://github.com/mpneuried/redis-heartbeat)|Pulse a heartbeat to redis. This can be used to detach or attach servers to nginx or similar problems.|
|[**systemhealth**](https://github.com/mpneuried/systemhealth)|Node module to run simple custom checks for your machine or it's connections. It will use [redis-heartbeat](https://github.com/mpneuried/redis-heartbeat) to send the current state to redis.|
|[**rsmq-cli**](https://github.com/mpneuried/rsmq-cli)|a terminal client for rsmq|
|[**rest-rsmq**](https://github.com/smrchy/rest-rsmq)|REST interface for.|
|[**nsq-logger**](https://github.com/mpneuried/nsq-logger)|Nsq service to read messages from all topics listed within a list of nsqlookupd services.|
|[**nsq-topics**](https://github.com/mpneuried/nsq-topics)|Nsq helper to poll a nsqlookupd service for all it's topics and mirror it locally.|
|[**nsq-nodes**](https://github.com/mpneuried/nsq-nodes)|Nsq helper to poll a nsqlookupd service for all it's nodes and mirror it locally.|
|[**nsq-watch**](https://github.com/mpneuried/nsq-watch)|Watch one or many topics for unprocessed messages.|
|[**redis-sessions**](https://github.com/smrchy/redis-sessions)|An advanced session store for NodeJS and Redis|
|[**connect-redis-sessions**](https://github.com/mpneuried/connect-redis-sessions)|A connect or express middleware to simply use the [redis sessions](https://github.com/smrchy/redis-sessions). With [redis sessions](https://github.com/smrchy/redis-sessions) you can handle multiple sessions per user_id.|
|[**redis-notifications**](https://github.com/mpneuried/redis-notifications)|A redis based notification engine. It implements the rsmq-worker to safely create notifications and recurring reports.|
|[**hyperrequest**](https://github.com/mpneuried/hyperrequest)|A wrapper around [hyperquest](https://github.com/substack/hyperquest) to handle the results|
|[**task-queue-worker**](https://github.com/smrchy/task-queue-worker)|A powerful tool for background processing of tasks that are run by making standard http requests
|[**soyer**](https://github.com/mpneuried/soyer)|Soyer is small lib for server side use of Google Closure Templates with node.js.|
|[**grunt-soy-compile**](https://github.com/mpneuried/grunt-soy-compile)|Compile Goggle Closure Templates ( SOY ) templates including the handling of XLIFF language files.|
|[**backlunr**](https://github.com/mpneuried/backlunr)|A solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js|
|[**domel**](https://github.com/mpneuried/domel)|A simple dom helper if you want to get rid of jQuery|
|[**obj-schema**](https://github.com/mpneuried/obj-schema)|Simple module to validate an object by a predefined schema|

## License 

(The MIT License)

Copyright (c) 2010 TCS &lt;dev (at) tcs.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
