var defer = require('deferred');

/**
 * @constructor
 */
var Job = function()
{
  this._defer = defer();
  this.done().then(null, function(err)
  {
    throw err;
  });
};

module.exports = Job;

/**
 * Start executing the job
 */
Job.prototype.start = function()
{
  throw new Error('Not implemented');
};

Job.prototype.done = function()
{
  return this._defer.promise;
};
