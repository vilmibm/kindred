#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var jade = require('jade');
var markdown = require('markdown').markdown;
var argv = require('optimist').argv

// Usage: kindred.js template_file publish_dir target_dir

if (argv.help) {
  [ "kindred",
    "Usage: kindred [--interval <seconds>] template_file publish_dir target_dir",
    "\t --interval  check for posts this many seconds (defaults to 10)",
    "\t template_file  a jade template",
    "\t publish_dir  a directory full of markdown files",
    "\t target_dir  a directory to drop a rendered index.html",
    "",
    "kindred is a tiny blogging engine for nodejs designed to be as convenient",
    "as possible to use. While kindred is running, simply dropping markdown files",
    "into the specified publish_dir will cause them to be rendered with the",
    "specified template.jade every <interval> seconds.",
    "",
    "Important: each post must be concluded with a desired publish date in the following",
    "format:",
    "",
    "_YYYY-MM-DD HH:MM_",
    "",
    "kindred will publish posts in date descending order."
  ].forEach(function(s) { console.log(s)});
  process.exit(0);
}

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
      fs.readFile(path.join(publish_dir, x), 'utf8', function(err, data) {
        if (err) { console.log("Err reading "+x); files_out++; return; }
        var publish_date = data.match(/_\d\d\d\d-\d\d-\d\d \d\d:\d\d_\s*$/);
        if (!publish_date) {
          function pad(x) {
            var y = String(x);
            return y.length === 1 ? "0" + y : y
          }
          // could use fs.stat but it will probably be close to Date.now() anyway
          var d = new Date();
          var year   = pad(d.getFullYear());
          var month  = pad(d.getMonth() + 1);
          var day    = pad(d.getDate());
          var hour   = pad(d.getHours());
          var minute = pad(d.getMinutes());

          publish_date = "_"+year+"-"+month+"-"+day+" "+hour+":"+minute+"_";
          // append to in-mem version so we can go ahead and use it without
          // waiting for file update
          data += ("\n" + publish_date);
          // append publish_date to post so we pick it up next time
          fs.open(path.join(publish_dir, x), 'a', 666, function(err,fd) {
            fs.write(fd, "\n"+publish_date, null, 'utf8', function(err){
                if (err) { console.error(err); }
            });
          });
        }
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
