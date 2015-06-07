var util = require('util');

var Base = require('lib/base.js');

var MockBase = function()
{
  MockBase.super_.call(this);
};

util.inherits(MockBase, Base);
module.exports = function(_begin)
{
  var mb = new MockBase();
  mb._begin = _begin || function(){};
  return mb;
};
