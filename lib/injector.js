var annotate = require('./annotate');

var VALID = /^([$_a-z][$_a-z1-9]*$)/i;

function Injector() {
  this.providers = {};
  this.cache = {};
}

Injector.prototype.get = function(serviceName) {
  if (this.cache.hasOwnProperty(serviceName)) {
    return this.cache[serviceName];
  } else if (this.providers.hasOwnProperty(serviceName)) {
    this.cache[serviceName] = this.providers[serviceName]();
    return this.cache[serviceName];
  } else {
    throw new Error('Injector: service not found `' + serviceName + '`');
  }
};

Injector.prototype.invoke = function(fn, self, locals) {
  var args = [];
  var $inject = annotate(fn);

  for (var i = 0, key, length = $inject.length; i < length; i++) {
    key = $inject[i];
    args.push( locals && locals.hasOwnProperty(key) ? locals[key] : this.get(key));
  }

  return fn.apply(self, args);
};

Injector.prototype.provide = function(serviceName, fn) {
  if (VALID.exec(serviceName)) {
    this.providers[serviceName] = fn;
  } else {
    throw new Error('Injector: invalid service name `' + serviceName + '`');
  }
};

module.exports = Injector;
