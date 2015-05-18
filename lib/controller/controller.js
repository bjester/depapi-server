var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 *
 * @constructor
 */
var Controller = function()
{
  this._routes = [];
};

Controller.EVENTS = {
  REQUEST: 'REQ',
  RESPONSE: 'RESP'
};

util.inherits(Controller, EventEmitter);
module.exports = Controller;

Controller.prototype._routes = null;

/**
 * Add a route object that this controller will handle
 *
 * @param {Route} route
 * @returns {Controller}
 */
Controller.prototype.addRoute = function(route)
{
  this._routes.push(route);
  return this;
};

/**
 *
 * @returns {Route[]}
 */
Controller.prototype.getRoutes = function()
{
  return this._routes;
};

/**
 * Generate a function to add as a handler for a Hapi route
 *
 * @returns {Function}
 */
Controller.prototype.getRequestHandler = function(server, route)
{
  var self = this;

  return function(req, resp)
  {
    self.emit(Controller.EVENTS.REQUEST, req, resp);
    self.handleRequest(server, route, req, resp);
  };
};

/**
 * Abstract method to process a request and provide a response
 *
 * @param {hapi.Request} req
 * @param {hapi.Response} resp
 */
Controller.prototype.handleRequest = function(server, route, req, resp)
{
  throw new Error("The method 'handleRequest' is unimplemented");
};
