#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var mandir = require('./mandir.js');
var markdown = require('markdown');

// Usage: kindred.js template_file publish_dir target_dir

var template_file = process.argv[1];
var publish_dir = process.argv[2];
var target = process.argv[3];
if (!template_file) { process.exit("Need a template file path."); }
if (!publish_dir) { process.exit("Need a publish_dir directory."); }
if (!target_dir) { process.exit("Need a target directory to publish index.html to"); }

function tick() {
  // Collect posts from publish_dir and fill up an array to render as
  // target_dir/index.html with template_file
  var files_in = 0;
  var files_out = 0;
  var posts = [];
  fs.readDir(publish_dir, function(err, files) {
    files.forEach(function(x) {
      files_in++;
      // TODO support _img and friends
      if (!x.match(/_txt$/)) { return; }
      fs.readFile(path.join(publish_dir, x), 'utf8', function(err, data) {
        if (err) { console.log("Err reading "+x); files_out++; return; }
        var publish_date = data.match(/_\d\d\d\d-\d\d-\d\d \d\d:\d\d_\s*$/);
        if (!publish_date) { console.log("No publish date for "+x); files_out++; return;) }
        posts.push({
          id: x,
          content: markdown.toHTML(data),
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
            fs.writeFile(path.join(target_dir, 'index.html'), html, function(err) {
              if (err) { console.log("error writing to "+publish_dir+" index.html"); }
            });
          });
        }
      });
    });
  });
}

setInterval(tick, 5000);
