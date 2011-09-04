# kindred

A minimal static blogengine that watches a directory for posts in markdown.

## Usage
kindred [--interval <seconds>] template_file publish_dir target_dir
--interval  check for posts this many seconds (defaults to 10)
template_file  a jade template
publish_dir  a directory full of markdown files
target_dir  a directory to drop a rendered index.html

While kindred is running, simply move markdown files into `publish_dir`. They
will be published every `interval` seconds using `template.jade`.

Important: each post must be concluded with a desired publish date in the following
format:

\_YYYY-MM-DD HH:MM\_

kindred will publish posts in date descending order.

## Disclaimer

## Author

Nathaniel K Smith <nathanielksmith@gmail.com> [http://chiptheglasses.com]

## License

## Name

kindred is named for Philip Kindred Dick.
