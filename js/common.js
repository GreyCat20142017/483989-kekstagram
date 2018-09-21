'use strict';

(function () {

  window.common = {
    getUniqueFromArray: function (arr) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        obj[arr[i].toString()] = true;
      }
      return Object.keys(obj).map(function (key) {
        return key;
      });
    },

    shuffleArray: function (arr) {
      var array = arr.slice();
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    getLimitedValue: function (newValue, leftLimit, rightLimit) {
      if (newValue < leftLimit) {
        return leftLimit;
      }
      if (newValue > rightLimit) {
        return rightLimit;
      }
      return newValue;
    },

    getValueByScale: function (min, max, level) {
      return Math.round(100 * (min + level * (max - min) / 100)) / 100;
    }

  };
})();
