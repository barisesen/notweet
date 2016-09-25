var pm2 = require('pm2');
var home = require('h0m3');
var init = require('./lib/FileSystem.js');
var globalModulesDir = require('global-modules');

init()
.then(function(value) {
  console.log(value);
  console.log('i am ready');
  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    pm2.start({
      script    : globalModulesDir + '/notweet/index.js',   // Script to be run
      exec_mode : 'fork',        // Allow your app to be clustered
      max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo
    }, function(err, apps) {
      pm2.disconnect();   // Disconnect from PM2
      if (err) throw err
    });
  });
})
.catch(function(val) {
  console.log('i am already ready :)');
  console.log(val);
  pm2.connect(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    pm2.start({
      script    : globalModulesDir + '/notweet/index.js',   // Script to be run
      exec_mode : 'fork',        // Allow your app to be clustered
      max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo
    }, function(err, apps) {
      pm2.disconnect();   // Disconnect from PM2
      if (err) throw err
    });
  });
})
