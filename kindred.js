#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var mandir = require('./mandir.js');

// Usage: kindred.js published_dir target_dir

var published = process.argv[1];
var target = process.argv[2];

if (!published) { process.exit("Need a published directory."); }

if (!target) { process.exit("Need a target directory to publish index.html to"); }

function tick() {
  // Collect posts from publish_dir and fill up an array to pass to publish()
  var files_in = 0;
  var files_out = 0;
  var posts = [];
  fs.readDir(published, function(err, files) {
    files.forEach(function(x) {
      files_in++;
      // TODO support _img and friends
      if (!x.match(/_txt$/)) { return; }
      fs.readFile(path.join(published, x), 'utf8', function(err, data) {
        if (err) { console.log("Err reading "+x); files_out++; return; }
        var publish_date = data.match(/_\d\d\d\d-\d\d-\d\d \d\d:\d\d_\s*$/);
        if (!publish_date) { console.log("No publish date for "+x); files_out++; return;) }
        posts.push({
          id: x,
          content: md.Markdown(data),
          publish_date: publish_date.toString()
        });
        files_out++;
        if (files_out === files_in) {
          posts.sort(function(a,b) {
            if (a.publish_date > b.publish_date) return -1;
            else if (a.publish_date < b.publish_date) return 1;
            else return 0;
          });
          template.render(template_path, {posts:posts}, function(err, html) {
            fs.writeFile(path.join(publish_dir, 'index.html'), html, function(err) {
              if (err) { console.log("error writing to "+publish_dir+" index.html"); }
            });
          });
        }
      });
    });
  });
}

setInterval(tick, 5000);
