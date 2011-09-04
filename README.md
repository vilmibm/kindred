# kindred

A minimal static blogengine that watches a directory for posts in markdown.

## Install

    npm install -g kindred

## Usage
    kindred [--interval <seconds>] template_file publish_dir target_dir
* __--interval__  check for posts this many seconds (defaults to 10)
* __template_file__  a jade template
* __publish_dir__  a directory full of markdown files
* __target_dir__  a directory to drop a rendered index.html

While kindred is running, simply move markdown files into `publish_dir`. They
will be published every `interval` seconds using `template.jade`.

Important: each post must be concluded with a desired publish date in the following
format:

\_YYYY-MM-DD HH:MM\_

kindred will publish posts in date descending order.

## Disclaimer

This blogging engine was written to be incredibly convenient to use...For me. Your mileage will vary. I've included the template I use for my site, http://chiptheglasses.com, as example_template.jade.

## Author

Nathaniel K Smith <nathanielksmith@gmail.com> http://chiptheglasses.com

## License

All code is licensed under a [Creative Commons Attribution-ShareAlike 3.0](http://creativecommons.org/licenses/by-sa/3.0/).

## Name

kindred is named for Philip Kindred Dick.
