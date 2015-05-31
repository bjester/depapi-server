require('test/lib/bootstrap.js');
var Server = require('lib/server.js');

describe('Server', function()
{
  describe('#constructor', function()
  {
    var config = require('test/lib/mock/config.js')(require('test/fixture/config.js'));
    
    it('should set config values for the connection', function(done)
    {
      var s = new Server(config);
      assert.equal(1, s.connections.length);
      
      var connection = s.connections[0];
      assert.equal(config.get('server.host'), connection['info']['host']);
      assert.equal(config.get('server.port'), connection['info']['port']);
      
      done();
    });
  });
});
