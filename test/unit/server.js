require('test/lib/bootstrap.js');
var defer = require('deferred');
var hapi = require('hapi');

var Base = require('lib/base.js');
var Server = require('lib/server.js');

describe('Server', function()
{
  var config = require('test/lib/mock/config.js')(require('test/fixture/config.js'));
  
  it('should inherit Base', function(done)
  {
    expect(Server).to.have.property('super_', Base);
    
    var s = Server.get(config);
    expect(s).to.be.instanceOf(Base);
    expect(s).to.be.instanceOf(Server);
    done();
  });
  
  describe('Server.get()', function() 
  {
    it('should create a hapi.Server instance', function(done)
    {
      var s = Server.get(config);
      expect(s._server).to.be.instanceOf(hapi.Server);
      done();
    });
    
    it('should set config values for the connection', function(done)
    {
      var s = Server.get(config);
      expect(s._server.connections).to.have.length(1);
      
      var connection = s._server.connections[0];
      expect(connection).to.have.property('info');
      expect(connection.info).to.have.property('host', config.get('server.host'));
      expect(connection.info).to.have.property('port', config.get('server.port'));
      
      done();
    });
  });
  
  describe('#constructor', function()
  {
    it('should call parent constructor', function(done)
    {
      Server.prototype.__construct = function()
      {
        this.testValue = true;
        Base.prototype.__construct.call(this);
      };
      
      var s = Server.get(config);
      expect(s).to.have.property('testValue', true);
      
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
    
    it('should call hapi.Server.start', function()
    {
      var s = Server.get(config);
      s._server.start = function(callback)
      {
        callback();
      };
      
      return expect(s.start()).to.be.fulfilled;
    });
    
    it('should reject on error', function()
    {
      var err = 'some error';
      
      var s = Server.get(config);
      s._server.start = function(callback)
      {
        callback(err);
      };
      return expect(s.start()).to.be.rejectedWith(err);
    });
  });
  
  describe('.addController()', function()
  {
    var controllerFixture = require('test/fixture/controller.js');
    var routeFixture = require('test/fixture/route.js');
    var testController = require('test/lib/mock/controller.js')(controllerFixture);
    
    it('should add controller to array', function(done)
    {
      var s = Server.get(config);
      s.addController(testController);
      
      expect(s._controllers).to.have.length(1);
      done();
    });
  });
});
