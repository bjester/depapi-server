var util = require('util');

var hapi = require('hapi');
var defer = require('deferred');

var Base = require('lib/base.js');
var Storage = require('lib/storage/storage.js');

/**
 * @constructor
 * @param {hapi.Server} hapiServer
 */
var Server = function(hapiServer)
{
  this._server = hapiServer;  
  this._storage = null;
  this._jobQueue = [];
  this._controllers = [];
  this.__construct();
};

// Extend and export
util.inherits(Server, Base);
module.exports = Server;

/**
 * @param {Config} config
 * @return {Server}
 */
Server.get = function(config)
{
  var hapiServer = new hapi.Server();
  
  hapiServer.connection({
    host: config.get('server.host'),
    port: config.get('server.port')    
  });
  
  return new Server(hapiServer);
};

/**
 * Start the server
 *
 * @return {defer.promise}
 */
Server.prototype._begin = function()
{
  var hapiServer = this._server;
  
  var d = defer();
  
  hapiServer.start(function(err)
  {
    if (err)
    {
      return d.reject(err);
    }
    
    d.resolve();
  });
  
  return d.promise;
};

/**
 * Alias start to 'Base.begin'
 */
Server.prototype.start = Server.prototype.begin;

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
    this._server.route(routeConfig);
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
 * @param {Storage} storage
 */
Server.prototype.setStorage = function(storage)
{
  this._storage = storage;
  return this;
};

/**
 * @return {Storage|null} 
 */
Server.prototype.getStorage = function()
{
  if (!(this._storage instanceof Storage))
  {
    return null;
  }
  
  this.wait(this._storage.start());
  return this._storage;
};
