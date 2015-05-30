var defer = require('deferred');

/**
 * @constructor
 */
var Storage = function(options)
{
  this._options = options;
  
  this._defer = defer();
  this._promise = this._defer.promise;
};

module.exports = Storage;

/**
 * Start the storage device
 */
Storage.prototype.start = function()
{
  throw new Error("The method 'start' is unimplemented");
};

/**
 * Add callback to wait until storage is ready
 */
Storage.prototype.ready = function()
{
  return this._promise;
};

/**
 * Retrieve data for resource hash
 */
Storage.prototype.findForHash = function(hash)
{
  throw new Error("The method 'findForHash' is unimplemented");
};

/**
 * Completes the internal deferred object
 */
Storage.prototype.end = function()
{
  this._promise.done();
};
