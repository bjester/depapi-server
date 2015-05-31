require('test/lib/bootstrap.js');
var defer = require('deferred');
var hapi = require('hapi');
var Server = require('lib/server.js');

describe('Server', function()
{
  var config = require('test/lib/mock/config.js')(require('test/fixture/config.js'));
  
  it('should inherit Hapi Server', function(done)
  {
    expect(Server).to.have.property('super_', hapi.Server);
    
    var s = new Server(config);
    expect(s).to.be.instanceOf(hapi.Server);
    expect(s).to.be.instanceOf(Server);
    done();
  });
  
  describe('#constructor', function()
  {
    it('should call parent constructor', function(done)
    {
      var superConstructor = Server.super_;
      
      Server.super_ = function()
      {
        this.testValue = true;
        this.constructor = superConstructor;
        superConstructor.call(this);
      };
      
      var s = new Server(config);
      expect(s).to.have.property('testValue', true);
      
      done();
    });
    
    it('should set config values for the connection', function(done)
    {
      var s = new Server(config);
      expect(s.connections).to.have.length(1);
      
      var connection = s.connections[0];
      expect(connection).to.have.property('info');
      expect(connection.info).to.have.property('host', config.get('server.host'));
      expect(connection.info).to.have.property('port', config.get('server.port'));
      
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
      expect(s).to.have.property('_jobQueue')
        .that.is.instanceOf(Array);
      done();
    });
    
    it('should initialize the controllers array', function(done)
    {
      var s = new Server(config);
      expect(s).to.have.property('_controllers')
        .that.is.instanceOf(Array);
      done();
    });
  });
  
  describe('.start()', function()
  {
    it('should call super start', function()
    {
      Server.super_.prototype.start = function(callback)
      {
        callback();
      };
      
      var s = new Server(config);
      return expect(s.start()).to.be.fulfilled;
    });
    
    it('should reject on error', function()
    {
      var err = 'some error';
      
      Server.super_.prototype.start = function(callback)
      {
        callback(err);
      };
      
      var s = new Server(config);
      return expect(s.start()).to.be.rejectedWith(err);
    });
  });
});
