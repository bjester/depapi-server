var util = require('util');
var Controller = require('lib/controller/controller.js');

/**
 * Resource response controller
 *
 * @constructor
 */
var Resource = function()
{
  Controller.call(this);
};

util.inherits(Resource, Controller);
module.exports = Resource;

/**
 * @param {Server} server
 * @param {Route} route
 * @param {hapi.Request} req
 * @param {hapi.Response} resp
 */
Resource.prototype.handleRequest = function(server, route, req, resp)
{
  
};
