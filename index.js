var path = require('path');
var fs   = require('fs');
var Injector = require('./lib/injector');

module.exports = function(gulp) {

  gulpy = {};

  var injector = new Injector();

  gulpy.include = function(dir) {
    var dirname = path.resolve(dir);
    fs.readdirSync(dirname).forEach(function(file) {
      var filepath = dirname + '/' + file;
      if (fs.statSync(filepath).isFile()) {
        return require(dirname + '/' + file);
      }
    });
  };

  gulpy.library = function(dir) {
    var dirname = path.resolve(dir);
    fs.readdirSync(dirname).forEach(function(file) {
      var ext = path.extname(file);
      var name = path.basename(file, ext);
      injector.provide(name, function() {
        return require(dirname + '/' + file);
      });
    });
  };

  gulpy.alias = function(require, aliases) {
    Object.keys(aliases).forEach(function(alias) {
      var module = aliases[alias];
      injector.provide(alias, function() {
        return require(module);
      });
    });
  };

  var _task = gulp.task;
  /**
   *  Wraps the original gulp.task to allow dependency injection
   */
  gulp.task = function(name, dep, fn) {
    if (!fn && typeof dep === 'function') {
      fn = dep;
      dep = undefined;
    }

    fn = fn || function() {};

    // TODO: add promise support


    var wrap = function(cb) {
      return injector.invoke(fn, this, {
        cb: cb,
        callback: cb
      });
    };

    return _task.call(gulp, name, dep, wrap);
  };

  return gulpy;
};
