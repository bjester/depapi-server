var util = require('util');
var url = require('url');
var defer = require('deferred');
var MongoClient = require('mongodb').MongoClient;
var Storage = require('lib/storage/storage.js');

var Mongo = function(options, db)
{
  Storage.call(this, options);
  
  if (!('hostname' in options) || !('port' in options))
  {
    throw new Error("'hostname' and 'port' are required");
  }
  
  this._options.protocol = 'mongodb';
  this._options.pathname = db;
};

util.inherits(Mongo, Storage);
module.exports = Mongo;

Mongo.HASH_COLLECTION = 'resources';

Mongo.prototype.start = function()
{
  var def = this._defer;
  var connect = url.format(this._options);
  
  MongoClient.connect(connect, function(err, db)
  {
    if (err)
    {
      return def.reject(err);
    }
    
    def.resolve(db);
  });
  
  this._promise.then(null, function(err)
  {
    throw err;
  });
  
  return this._promise;
};

Mongo.prototype.findForHash = function(hash)
{
  var d = defer();
  
  this.ready(function(db)
  {
    var collection = db.collection(Mongo.HASH_COLLECTION);
    collection.find({hash: hash}).toArray(function(err, docs)
    {
      if (err)
      {
        return d.reject(err);
      }
      
      d.resolve(docs);
    });
  });
  
  return d.promise;
};
