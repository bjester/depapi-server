var util = require('inherits');

var defer = require('deferred');
var md5 = require('js-md5');

var Controller = require('lib/controller/controller.js');
var BundleJob = require('lib/job/bundle.js');

/**
 * Resource bundling controller
 *
 * @constructor
 */
var Bundle = function()
{
  Controller.call(this);
};

util.inherits(Bundle, Controller);
module.exports = Bundle;

Bundle.prototype.handleRequest = function(server, route, req, resp)
{
  var storage = server.getStorage();
  
  var files = req.params.entry_points
    .map(function(val)
    {
      return val.path;
    })
    .sort();
  
  var respObj = {
    bundle: []
  };
  
  respObj.bundle.push(this.getBundleForFiles(server, files));
  resp(respObj).close();
  
  var bundleJob = new BundleJob(hash, files);
  server.queueJob(bundleJob);
};

Bundle.prototype.getBundleForFiles = function(server, files, env) 
{
  var hash = md5(JSON.stringify(files));
  var bundle = {};
  
  bundle.path = this.getResourceUrl(hash);
  
  if ((env && env !== 'prod') || server.getEnv() !== 'prod')
  {
    bundle.map = this.getResourceMapUrl(hash);
  }
  
  return bundle;
};


Bundle.prototype.getResourceUrl = function(hash)
{
  
};

Bundle.prototype.getResourceMapUrl = function(hash)
{
  
};
