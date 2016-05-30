// https://github.com/angular/angular.js/blob/v1.5.6/src/auto/injector.js

var ARROW_ARG = /^([^\(]+?)=>/;
var FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function stringifyFn(fn) {
  return Function.prototype.toString.call(fn) + ' ';
}

function extractArgs(fn) {
  var fnText = stringifyFn(fn).replace(STRIP_COMMENTS, ''),
      args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
  return args;
}

module.exports = function(fn) {
  if (fn.$inject) { return fn.$inject; }
  var $inject = fn.$inject || [];
  var fnText = fn.toString().replace(STRIP_COMMENTS, '');
  argDecl = extractArgs(fn);
  argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
    arg.replace(FN_ARG, function(all, underscore, name) {
      $inject.push(name);
    });
  });
  return $inject;
};
