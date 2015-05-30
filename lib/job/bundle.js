var util = require('util');
var fs = require('fs');
var defer = require('deferred');
var browserify = require('browserify');
var exorcist = require('exorcist');
var Job = require('lib/job/job.js');

/**
 * 
 * @param {String[]} files
 * @constructor
 */
var Bundle = function(files)
{
  this._files = files;
  Job.call(this);
};

util.inherits(Bundle, Job);
module.exports = Bundle;

/**
 * Start executing the job
 */
Bundle.prototype.start = function()
{
  var self = this;
  var resourceFile = '';
  var mapFile = '';
  
  try
  {
    var written = defer();
    var writeStream = this.getResourceStream(resourceFile);
    writeStream.on('finish', function()
    {
      written.resolve();
    });
    
    var mapped = defer();
    var mapStream = this.getMapStream(mapFile);
    mapStream.on('finish', function()
    {
      mapped.resolve();
    });
    
    var bundled = defer(1);
    browserify({ debug: true })
      .add(this._files)
      .transform('uglifyify')
      .bundle()
      .pipe(mapStream)
      .pipe(writeStream);
  }
  catch (e)
  {
    this._defer.reject(e);
  } 
  
  return bundled.then(written.promise).then(mapped.promise).then(function()
  {
    self._defer.resolve(resourceFile, mapFile);
  });
};

/**
 * @param {String} resourceFile
 * @return {stream.Writeable}
 */
Bundle.prototype.getResourceStream = function(resourceFile)
{
  return fs.createWriteStream(resourceFile);
};


/**
 * @param {String} mapFile
 * @return {stream.Writeable}
 */
Bundle.prototype.getMapStream = function(mapFile)
{
  return exorcist(mapFile);
};
