#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var jade = require('jade');
var markdown = require('markdown').markdown;

// Usage: kindred.js template_file publish_dir target_dir

var template_file = process.argv[2];
var publish_dir = process.argv[3];
var target_dir = process.argv[4];
if (!template_file) { console.log("Need template file path"); process.exit(1); }
if (!publish_dir) { console.log("Need a publish_dir directory."); process.exit(1); }
if (!target_dir) { console.log("Need a target directory to publish index.html to"); process.exit(1); }

var render_template = jade.compile(fs.readFileSync(template_file, 'utf8'), {});
var target_file = path.join(target_dir, 'index.html');

function tick() {
  // Collect posts from publish_dir and fill up an array to render as
  // target_dir/index.html with template_file
  var files_in = 0;
  var files_out = 0;
  var posts = [];
  fs.readdir(publish_dir, function(err, files) {
    files.forEach(function(x) {
      files_in++;
      // TODO support _img and friends
      if (!x.match(/_txt$/)) { return; }
      fs.readFile(path.join(publish_dir, x), 'utf8', function(err, data) {
        if (err) { console.log("Err reading "+x); files_out++; return; }
        var publish_date = data.match(/_\d\d\d\d-\d\d-\d\d \d\d:\d\d_\s*$/);
        if (!publish_date) { console.log("No publish date for "+x); files_out++; return; }
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
          fs.writeFile(target_file, render_template({posts:posts}), function(err) {
            if (err) { console.log("error writing to "+target_file); }
          });
        }
      });
    });
  });
}

process.on('SIGHUP', function() { tick(); })

tick();
setInterval(tick, 10000);
