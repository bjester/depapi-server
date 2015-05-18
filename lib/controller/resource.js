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

Resource.prototype.handleRequest = function(server, route, req, resp)
{
  
};
