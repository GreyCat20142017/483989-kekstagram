'use strict';

(function () {
  var Zoomer = function (min, max, step, value) {
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
  };

  Zoomer.prototype.increase = function () {
    this.value = (this.value + this.step) > this.max ? this.max : (this.value + this.step);
    return this.value;
  };

  Zoomer.prototype.decrease = function () {
    this.value = (this.value - this.step) < this.min ? this.min : (this.value - this.step);
    return this.value;
  };

  Zoomer.prototype.getValue = function () {
    return this.value;
  };

  Zoomer.prototype.setValue = function (newValue) {
    this.value = newValue;
  };

  window.zoomer = {
    Zoomer: Zoomer
  };
})();
