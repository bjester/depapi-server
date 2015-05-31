var util = require('util');
var Controller = require('lib/controller/controller.js');

var TestController = function() {};

TestController.prototype.handleRequest = function(server, route, req, resp)
{
  
};

util.inherits(TestController, Controller);

module.exports = function(fixture)
{
  var controller = new TestController();
  
  if (fixture)
  {
    controller._routes = fixture._routes;
  }
  
  return controller;
};
