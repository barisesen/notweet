#!/usr/bin/env node
var init = require('./lib/FileSystem.js');
var Twit = require('twit')
var notifier = require('node-notifier');
var path = require('path');

init()
  .catch(function(val) {
    // console.log(val);
  })

init.config().then(function(config) {
  console.log(config);

  var T = new Twit(config);

  var stream = T.stream('statuses/filter', { track:[config.track]})
    stream.on('tweet', function (tweet) {
      notifier.notify({
        title: tweet.user.screen_name,
        message: tweet.text,
        icon: path.join(__dirname, 'ico.png'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification
      }, function (err, response) {
        // Response is response from notification
        // console.log(response);
        console.log(err);
      });

      console.log(tweet.text);
    });

})
