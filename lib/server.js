var util = require('util');

var hapi = require('hapi');
var defer = require('deferred');

/**
 *
 * @constructor
 */
var Server = function(config)
{
  this._defer = defer();
  this._promise = this._defer.promise;
  this._storage = null;
  this._jobQueue = [];
  
  this._controllers = [];
  hapi.Server.call(this);
  
  this.connection({
    host: config.get('server.host'),
    port: config.get('server.port')
  });
};

// Extend and export
util.inherits(Server, hapi.Server);
module.exports = Server;

Server.prototype._controllers = null;

/**
 * Start the server
 *
 * @return {defer.promise}
 */
Server.prototype.start = function()
{
  var start = this.super_.start.bind(this);
  
  // Start the chain
  this._defer.resolve();
  
  return this._promise.then(function()
  {
    var d = defer();
    
    start(function()
    {
      d.resolve();
    });
    
    return d.promise;
  });
};

/**
 * Adds controllers/routes to the Hapi server
 *
 * @param {Controller} controller
 * @return {Server}
 */
Server.prototype.addController = function(controller)
{
  this._controllers.push(controller);
  var routes = controller.getRoutes();

  for (var i = 0; i < routes.length; i++)
  {
    var route = routes[i];
    var routeConfig = route.get();
    routeConfig.handler = controller.getRequestHandler(this, routes[i]);
    this.route(routeConfig);
  }

  return this;
};

/**
 * @param {Job} job
 */
Server.prototype.queueJob = function(job)
{ 
  this._jobQueue.push(job);
  
//  if (this._jobQueue.length )
  
  return this;
};

/**
 * 
 */
Server.prototype.processJob = function(job)
{
  var queue = this._jobQueue;
  
  job.start().then(function()
  {
    
  }).done();
};

/**
 * Add a promise to wait for
 */
Server.prototype.wait = function(waitFor)
{
  // Add to the wait chain
  this._promise = this._promise.then(waitFor);
  return this;
};

/**
 * @param {Storage} storage
 */
Server.prototype.setStorage = function(storage)
{
  this._storage = storage;
  return this;
};

/**
 * @return {Storage} 
 */
Server.prototype.getStorage = function()
{
  this.wait(this.storage.start());
  return this._storage;
};
