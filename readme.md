## Gulpy - A gulp extension with dependency injection.


#### Documenations

Soon ...

#### Example:

```js

// gulpfile.js

var gulp = require('gulp');

var gulpy = require('gulpy')(gulp);

gulpy.include('tasks/');

gulpy.library('tasks/lib/');

gulpy.alias(require, {
  rimraf: 'rimraf',
  run: 'run-sequence'
});


// tasks/default.js

var gulp = require('gulp');

gulp.task('default', function(config, rimraf, run, callback) {
  rimraf.sync(config.stage);
  run([ 'html', 'scss', 'js', 'sprite' ], 'watch', callback);
});


// tasks/lib/config.json

{
  "stage": "dist/"
}


```

