var util = require('util');
var EventEmitter = require('events').EventEmitter;

var defer = require('deferred');

/**
 * @constructor
 */
var Base = function()
{
  this.__construct();
};

Base.EVENTS = {
  BEFORE: 'before',
  READY: 'ready',
  ERROR: 'error'
};

util.inherits(Base, EventEmitter);
module.exports = Base;

/**
 * @constructor
 */
Base.prototype.__construct = function()
{
  var self = this;
  
  this._begun = false;
  this._ready = defer();
  this._before = defer();
  this._wait = new Array();
  
  this.before().then(function()
  {
    self.emit(Base.EVENTS.BEFORE, self);
  });
    
  this.ready().then(function()
  {
    var args = [ Base.EVENTS.READY ];
    args.push.apply(args, arguments);
    self.emit.apply(self, args);
  },
  function()
  {
    var args = [ Base.EVENTS.ERROR ];
    args.push.apply(args, arguments);
    self.emit.apply(self, args);
  });
};

/**
 * Returns the Promise that is resolved before the classes
 * main execution is called
 * 
 * @return {Promise}
 */
Base.prototype.before = function()
{
  return this._before.promise;
};

/**
 * This method is similar to `before`, except that it doesn't
 * return the internal promise object, but instead accepts
 * an argument of either a callback or Promise.  If a promise
 * or a callback that returns a promise, then it will wait
 * until the promise is resolved before continuing.
 * 
 * @param {Function|Promise} waitFor
 * @return {Base}
 */
Base.prototype.wait = function(waitFor)
{
  this._wait.push(this._before.promise.then(waitFor));
  return this;
};

/**
 * Returns a promise which resolves once all `wait`
 * promises are resolved, and hence the `begin` process
 * can continue
 * 
 * @return {Promise}
 */
Base.prototype._pre = function()
{
  var canBegin;
  
  if (this._wait.length !== 0)
  {
    var self = this;
    canBegin = defer.map(this._wait).then(function()
    {
      for (var i = 0; i < self._wait.length; i++)
      {
        self._wait[i].done();
      }
    });
  }
  
  this._before.resolve();
  return canBegin || this.before();
};

/**
 * To be implemented by child class, if `begin` is not overridden
 */
Base.prototype._begin = function()
{
  throw new Error('Method `begin` not implemented');
};

/**
 * Executes `_begin` once all `wait` promises are resolved.
 * 
 * @return {Promise}
 */
Base.prototype.begin = function()
{
  if (this._begun)
  {
    return defer(1);
  }
  
  var self = this;
  
  return this._pre()
    .then(this._begin.bind(this))
    .then(function(){ self._begun = true; })
    .then(this._post.bind(this));
};

/**
 * Resolves `ready` and does some cleanup
 * 
 * @return {Promise}
 */
Base.prototype._post = function()
{
  this._ready.resolve.apply(this._ready, arguments);
  this.ready().done();
};

/**
 * @return {Promise}
 */
Base.prototype.ready = function()
{
  return this._ready.promise;
};
