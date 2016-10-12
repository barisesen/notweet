#!/usr/bin/env node
var pm2 = require('pm2');
var home = require('h0m3');
var init = require('./lib/FileSystem.js');
var globalModulesDir = require('global-modules');
var program = require('commander');
var fs = require('fs');
program
  .option('-c, --close', 'Close app')
  .option('-n, --new_key <newkey>', 'New keywords')
  // .option('-n, --newkeyword <newkeyword>', 'Add new keywords')
  .parse(process.argv);

if(program.new_key) {
  // console.log(program.new_key);
  home()
    .then((dir) => {
      var path = `${dir}/.notweet/config.json`;
      fs.readFile(path, function(err, data) { // read file to memory
        if (!err) {
            try {
              data = JSON.parse(data.toString());
              data.track = program.new_key;

              fs.writeFile(path, JSON.stringify(data), function(err) { // write file
                  if (err) { // if error, report
                    console.log(err);
                  }
                  console.log('Config updated.');
              });
            } catch (e) {
              console.log(e);
            }
        } else {
          console.log(err);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    })
}

if(program.close) {
  console.log('Please wait, process killing');
  pm2.delete('notweet', function(err) {})
  pm2.disconnect();
  setTimeout(function () {
    process.exit();
  }, 2 * 1000);
} else {
  init()
  .then(function(value) {
    // console.log(value);
    console.log('i am ready');
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.start({
        name: 'notweet',
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
    console.log(val);
    console.log('i am already ready :)');
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.start({
        name: 'notweet',
        script    : globalModulesDir + '/notweet/index.js',   // Script to be run
        exec_mode : 'fork',        // Allow your app to be clustered
        max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo
      }, function(err, apps) {
        pm2.disconnect();   // Disconnect from PM2
        if (err) throw err
      });
    });
  })
}
