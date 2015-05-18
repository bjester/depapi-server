var defer = require('deferred');
var scheme = require('hapi-auth-bearer-token');

/**
 * Validate is either a function or string for validating token
 * 
 * @params {String|Function} validate
 */
var Token = function(validate)
{
  this._strategy = 'token';
  this._queryParam = 'access_token';
  this._validate = validate;
};

module.exports = Token;

/**
 * @param {Server} server
 */
Token.prototype.registerWithServer = function(server) 
{
  var strategy = this._strategy;
  var validate = ((typeof this._validate == 'function')
    ? this._validate
    : function(token, callback)
      {
        if (token === this._token)
        {
          callback(null, true, { token: token });
        } 
        else 
        {
          callback(null, false, { token: token });
        }
      }).bind(this);
  
  var d = defer();
  server.waitFor(d.promise);
  
  server.register(scheme, function(err)
  {
    if (err)
    {
      throw err;
    }
    
    server.auth.strategy(strategy, 'bearer-access-token', {
      accessTokenName: self._queryParam,
      validateFunc: validate
    });
    
    d.resolve();
  });
};

Token.prototype.getStrategy = function()
{
  return this.strategy;
};
