var defer = require('deferred');

var MockDefer = function() {};

MockDefer.prototype = defer();

var override = function(source, dest)
{
  for (var k in source)
  {
    var f = dest[k];
    var e = source[k];
    
    dest[k] = function()
    {
      e();
      return f.call(this);
    };
  }
  
  return dest;
};

module.exports = function(onDefer, onPromise)
{
  var d = new MockDefer();
  
  override(onDefer, d);
  d.promise = override(onPromise, d.promise);
  
  return d;
};
