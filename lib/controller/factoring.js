var util = require('inherits');

var defer = require('deferred');
var md5 = require('js-md5');
var clone = require('clone');

var BundleController = require('lib/controller/bundle.js');
var BundleJob = require('lib/job/bundle.js');

/**
 * Resource bundling controller
 *
 * @constructor
 */
var Factoring = function()
{
  BundleController.call(this);
  this._levels = [];
};

util.inherits(Factoring, BundleController);
module.exports = Factoring;

/**
 * @param {Server} server
 * @param {Route} route
 * @param {hapi.Request} req
 * @param {hapi.Response} resp
 */
Factoring.prototype.handleRequest = function(server, route, req, resp)
{
  if (!this._levels.length)
  {
    throw new Error('Factoring controller must have factoring levels');
  }
  
  var factored = clone(this._factored);
  var entryPoints = req.params.entry_points;
  
  for (var f = 0; f < entryPoints.length; f++)
  {
    if (this._levels.indexOf(entryPoints[f].level) < 0)
    {
      throw new Error('Controller received undefined level');
    }
    
    factored[entryPoints[f].level].push(entryPoints[f].path);
  }
  
  var respObj = { bundles: [] };
  for (var i = 0; i < this._levels; i++)
  {
    var bundle = this.getBundle(server, factored[this._levels[i]]);
    bundle.level = this._levels[i]; 
    respObj.push(bundle);
  }
  
  resp(respObj).close();
};

/**
 * Set the factoring levels and prepare an object template for factoring
 * 
 * @param {String[]} levels
 * @return {Factoring}
 */
Factoring.prototype.setLevels = function(levels)
{
  this._levels = levels;
  this._factored = {};
  
  for (var i = 0; i < this._levels; i++)
  {
    this._factored[this._levels[i]] = [];
  }
  
  return this;
};

