var notifier = require('node-notifier');
var path = require('path');
var cl0n3 = require('cl0n3');
var async = require('async');
var fs = require('fs');
var inquirer = require('inquirer')
var home = require('h0m3');
var exist = require('3x1st');
var colors = require('colors');

function insert(obj) {
  return new Promise(function(resolve, reject) {
    home()
      .then((dir) => {
        var path = `${dir}/.notweet/config.json`;
        fs.readFile(path, function(err, data) { // read file to memory
          if (!err) {
              try {
                data = JSON.parse(data.toString());
                data.consumer_key = obj.consumer_key;
                data.consumer_secret = obj.consumer_secret;
                data.access_token = obj.access_token;
                data.access_token_secret = obj.access_token_secret;
                data.track = obj.track;

                fs.writeFile(path, JSON.stringify(data), function(err) { // write file
                    if (err) { // if error, report
                        reject (err);
                    }
                    resolve('Config updated.');
                });
              } catch (e) {
                reject(e);
              }

          } else {
            reject(err);
          }
        });
      })
      .catch((err) => {reject(err);})
  });
}

function keyChange() {
  return new Promise(function(resolve, reject) {
      var questions = [
        {
          type: 'input',
          name: 'consumer_key',
          message: 'Your Consumer Key ?'
        },
        {
          type: 'input',
          name: 'consumer_secret',
          message: 'Your Consumer Secret Key ?'
        },
        {
          type: 'input',
          name: 'access_token',
          message: 'Your Access Token ?'
        },
        {
          type: 'input',
          name: 'access_token_secret',
          message: 'Your Access Token Secret Key ?'
        },
        {
          type: 'input',
          name: 'track',
          message: 'Your want to filter keywords ?'
        },
      ];
      inquirer.prompt(questions).then(function (answers) {
          resolve(answers);
      })
      .catch(function(value) {
        reject(value);
      })
  });
}


module.exports = function() {
  return new Promise((resolve, reject) => {
    var obj = {
      url: 'https://github.com/barisesen/notweet-config.git',
      name: '~/.notweet', // Optional.
    };

      home().then(function(homedir) {
        exist(homedir + '/' + '.notweet')
          .then(function(isExist) {
            console.log(colors.green('config is already init'));
            resolve('isExist');
          })
          .catch(function(err) {
            cl0n3.programmatic(obj)
              .then((value) => {
                console.log(colors.green('default config cloned'));

                keyChange().then(function(val) {
                  insert(val)
                    .then(function(value) {
                      resolve(value);
                    })
                    .catch(function(err) {
                      reject(err);
                    })
                })
              })
              .catch((err) => {reject(err);})

          })
      });

  })
}

module.exports.config = function () {
  return new Promise(function(resolve, reject) {
    home()
      .then((dir) => {
        var path = `${dir}/.notweet/config.json`;
        fs.readFile(path, function(err, data) { // read file to memory
          if (!err) {
              try {
                data = JSON.parse(data.toString());
                resolve(data);
              } catch (e) {
                reject(e);
              }

          } else {
            reject(err);
          }
        });
      })
      .catch((err) => {reject(err);})
  });
}
