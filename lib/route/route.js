/**
 * @param {String} method GET,POST
 * @param {String} path
 */
var Route = function(method, path)
{
  this._route = {
    method: method,
    path: path
  };  
};

module.exports = Route;

/**
 * 
 */
Route.prototype.setExpires = function(expires)
{
  if (!('cache' in this._route))
  {
    this._route.cache = {};
  }
  
  this._route.cache.expiresIn = expires;
  
  return this;
};

/**
 * 
 */
Route.prototype.setAuth = function(auth)
{
  if (!('config' in this._route))
  {
    this._route.config = {};
  }
  
  this._route.config.auth = auth.getStrategy();
  
  return this;
};

/**
 * @return {Object}
 */
Route.prototype.get = function()
{
  return this._route;
};
