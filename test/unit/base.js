require('test/lib/bootstrap.js');
var defer = require('deferred');
var hapi = require('hapi');
var MockBaseFactory = require('test/lib/mock/base.js');

describe('Base', function()
{
  describe('.__construct()', function()
  {
    it('should trigger ready event on ready()', function()
    {
      var done = defer();
      var b = MockBaseFactory();
      
      expect(done.promise).to.be.fulfilled;
      b.on('ready', function()
      {
        done.resolve();
      });
      
      b._ready.resolve();
      
      return done.promise;
    });
    
    it('should trigger error event when ready() errors', function()
    {
      var done = defer();
      var b = MockBaseFactory();
      
      expect(done.promise).to.be.fulfilled;
      b.on('error', function()
      {
        done.resolve();
      });
      
      b._ready.reject();
      
      return done.promise;
    });
  });
  
  describe('.before()', function()
  {
    it('should return ._before.promise', function(done)
    {
      var b = MockBaseFactory();
      expect(b.before()).to.equal(b._before.promise);
      done();
    });
  });
  
  describe('.wait()', function()
  {
    it('should add promises to array', function(done)
    {
      var d = defer();
      var b = MockBaseFactory();
      
      b.wait(d.promise);
      
      expect(b._wait).to.have.length(1);
      
      done();
    });
  });
  
  describe('._pre()', function()
  {
    it('should return ._before.promise if nothing to wait for', function(done)
    {
      var b = MockBaseFactory();
      
      var before = b.before();
      expect(b._pre()).to.equal(before);
      done();
    });
    
    it('should return a promise that resolves when all wait have resolved', function()
    {
      var testVal = false;
      var b = MockBaseFactory();
      var wait1 = defer();
      var wait2 = defer();
      
      b.wait(wait1.promise);
      b.wait(wait2.promise);
      
      var pre = b._pre().then(function()
      {
        testVal = true;
      });
      
      expect(wait1.promise).to.be.fulfilled.then(function()
      {
        expect(pre).not.to.be.fulfilled;
        expect(testVal).to.equal(false);
        expect(wait2.promise).to.be.fulfilled.then(function()
        {
          expect(pre).to.be.fulfilled;
        });
        
        wait2.resolve();
      });
      
      wait1.resolve();
      
      return pre;
    });
    
    it('should call done on _wait promises', function()
    {
      var testVal = 0;
      var b = MockBaseFactory();
      
      var d1 = function(){};
      var d2 = function(){};
      d1.done = d2.done = function()
      {
        testVal++;
      };
      
      b._wait = [d1, d2];

      var done = expect(b._pre()).to.be.fulfilled.then(function()
      {
        expect(testVal).to.equal(2);
      });
      
      return done;
    });
  });
  
  describe('.begin()', function()
  {
    it('should execute ._begin after ._pre() promise', function()
    {
      var testVal = false;
      var d = defer();
      var b = MockBaseFactory(function()
      {
        testVal = true;
      });
      
      b._pre = function()
      {
        return d.promise;
      };
      
      b.begin();
      expect(testVal).to.equal(false);
      
      var done = expect(d.promise).to.be.fulfilled.then(function()
      {
        expect(testVal).to.equal(true);
      });
      
      d.resolve();
      return done;
    });
    
    
    it('should execute ._post after ._pre() and ._begin() promise', function()
    {
      var testVal = false;
      var d1 = defer();
      var d2 = defer();
      
      var b = MockBaseFactory(function()
      {
        return d2.promise;
      });
      
      b._pre = function()
      {
        return d1.promise;
      };
      
      b._post = function()
      {
        testVal = true;
      };
      
      b.begin();
      expect(testVal).to.equal(false);
      
      var done = expect(d1.promise).to.be.fulfilled
        .then(function()
        {
          expect(testVal).to.equal(false);
          
          var done = expect(d2.promise).to.be.fulfilled.then(function()
          {
            expect(testVal).to.equal(true);
            expect(b._begun).to.equal(true);
          });
          
          d2.resolve();
          
          return done;
        });
      
      d1.resolve();
      return done;
    });
    
    it('should execute multiple before', function()
    {
      var beforeCount = 0;
      var b = MockBaseFactory();
      
      var before1 = b.before().then(function()
      {
        beforeCount++;
      }).done();
      
      var before2 = b.before().then(function()
      {
        beforeCount++;
      }).done();
      
      expect(b.begin()).to.be.fulfilled.then(function()
      {
        expect(before1).to.be.fulfilled;
        expect(before2).to.be.fulfilled;
        expect(beforeCount).to.equal(2);
      });
      
      return b.ready();
    });
    
    it('should skip if already begun', function() 
    {
      var b = MockBaseFactory();
      b._begun = true;
      
      return expect(b.begin()).to.be.fulfilled;
    });
  });

});
