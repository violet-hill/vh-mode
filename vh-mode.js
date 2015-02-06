angular.module('vh-mode').factory("VHMode", function() {
  function VHMode(callbacks, after) {
    this.callbacks = callbacks || {};
    this.state = null;
  }

  var prototype = VHMode.prototype;
  prototype.set = function(state) {
    var callback = this.callbacks[state];
    if(callback) callback.apply(this, _.tail(arguments));
    this.state = state;
  }
  prototype.reset = function(state) { this.set(null); }
  prototype.is = function(state) { return this.state == state; }
  prototype.isInit = function() { return this.is(null); }

  return VHMode;
});
