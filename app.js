var express = require('express');
var fs = require('fs');
var path = require('path');
var ytdl = require('ytdl-core');
var ytsearch = require('youtube-search');


var app = express();


app.get('/info/:id', function(req, res) {
    var id = req.params.id;

    ytdl.getInfo(id, function(err, info) {
        if (err) {
            res.status(500).json({
              state: 'error',
              message: err.message
            });
        } else {
            res.status(200).send(info);
        }
    })
});

app.get('/captions/:id', function(req, res) {
    var id = req.params.id;
    ytdl.getInfo(id, function(err, info) {
        if (err) {
            res.status(500).json({
              state: 'error',
              message: err.message
            });
        } else {
            res.status(200).send(JSON.parse(info.player_response));
        }
    })
});



app.get('/search/:query', function(req, res) {
    var query = unescape(req.params.query).toString();
    var lang = req.query.language || 'en';
    if (lang !== 'en' || lang !== 'de') {
      lang = 'en';
    }

    ytsearch(query, {
      maxResults: 10,
      type: 'video',
      relevanceLanguage: lang,
      key: 'AIzaSyBHHtE4lIdB0IDdlwWskZVGM0872bcXvQ4',
      order: 'viewCount'
    }, function(err, results) {
      if (err) {
        console.log('An error occurred: '+err.message);
        res.status(500).json({
          state: 'error',
          message: err.message
        });
      } else if (!results || !results.length) {
        console.log('No results found.');
        res.status(200).send({
          state: 'error',
          message: 'No results found'
        });
      } else {
        res.status(200).send(results);
      }
    });
  });



app.listen(5000, function() {
    console.log('Node app is running on port', 5000);
});
