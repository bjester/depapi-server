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
 * @returns {defer.promise}
 */
Server.prototype.start = function()
{
  var d = defer();
  var start = this.super_.start.bind(this);
  
  this._promise.then(function()
  {
    start(function()
    {
      d.resolve();
    });
    
    return d.promise;
  }).done();
  
  // Start the chain
  this._defer.resolve();

  return d.promise;
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
  return this._storage;
};
