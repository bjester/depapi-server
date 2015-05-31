var util = require('util');
var Route = require('lib/route/route.js');

var TestRoute = function() {};

util.inherits(TestRoute, Route);

module.exports = function(fixture)
{
  var route = new TestRoute();
  
  if (fixture)
  {
    route._route = fixture._route;
  }
  
  return route;
};
