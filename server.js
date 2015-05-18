var config = require('config');

var BundleControl = require('lib/controller/bundle.js');
var ResourceControl = require('lib/controller/resource.js');
var BundleRoute = require('lib/route/bundle.js');
var ResourceRoute = require('lib/route/resource.js');
var Server = require('lib/server.js');
var TokenAuth = require('lib/auth/token.js');
var Mongo = require('lib/storage/mongo.js');
/* ------------------------------------- */

var storage = new Mongo({
  hostname: config.get('mongo.host'),
  port: config.get('mongo.port')
});

var auth = new TokenAuth(config.get('auth.token'));

var bunRoute = new BundleRoute('POST', '/resources/bundle');
var resRoute = new ResourceRoute('GET', '/resources/get');
bunRoute.setAuth(auth);
resRoute.setExpires(60*60*24*14);

var bundleController = new BundleControl();
var resourceController = new ResourceControl();
bundleController.addRoute(bunRoute);
resourceController.addRoute(resRoute);

var server = new Server(config);
auth.registerWithServer(server);

server
  .setStorage(storage)
  .addController(bundleController)
  .addController(resourceController)
  .start();
