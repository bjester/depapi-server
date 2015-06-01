var util = require('util');
var EventEmitter = require('events');

var defer = require('deferred');

/**
 * @constructor
 */
var Base = function()
{
  var self = this;
  
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

Base.EVENTS = {
  BEFORE: 'before',
  READY: 'ready',
  ERROR: 'error'
};

util.inherits(Base, EventEmitter);

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
 * To be called by child class
 * 
 * Returns a promise which resolves once all `before`
 * promises are resolved, and hence the `begin` process
 * can continue
 * 
 * @return {Promise}
 */
Base.prototype._pre = function()
{
  var self = this;
  this._wait.resolve();
  
  return defer.apply(defer, this._wait).then(function()
  {
    for (var i = 0; i < self._wait.length; i++)
    {
      self._wait[i].done();
    }
  });;
};

/**
 * To be called by child class
 * 
 * Triggers `ready` once `wait` is resolved
 * 
 * @param {Promise} wait
 * @return {Promise}
 */
Base.prototype._post = function(wait)
{
  var self = this;
  
  return wait.then(function()
  {
    self._ready.resolve.apply(self._ready, arguments);
    self.ready().done();
  });
};

/**
 * @return {Promise}
 */
Base.prototype.ready = function()
{
  return this._ready.promise;
};
