require('test/lib/bootstrap.js');
var defer = require('deferred');
var Server = require('lib/server.js');

describe('Server', function()
{
  describe('#constructor', function()
  {
    var config = require('test/lib/mock/config.js')(require('test/fixture/config.js'));
    
    it('should set config values for the connection', function(done)
    {
      var s = new Server(config);
      expect(s.connections).to.have.length(1);
      
      var connection = s.connections[0];
      expect(connection['info']['host']).to.equal(config.get('server.host'));
      expect(connection['info']['port']).to.equal(config.get('server.port'));
      
      done();
    });
    
    it('should initialize the main deferred', function(done)
    {
      var s = new Server(config);
      expect(s._defer).to.be.instanceOf(defer.Deferred);
      done();
    });
    
    it('should initialize the job queue', function(done)
    {
      var s = new Server(config);
      expect(s._jobQueue).to.be.instanceOf(Array);
      done();
    });
    
    it('should initialize the controllers array', function(done)
    {
      var s = new Server(config);
      expect(s._controllers).to.be.instanceOf(Array);
      done();
    });
  });
});
