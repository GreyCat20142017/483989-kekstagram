'use strict';

(function () {

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  window.common = {
    getUniqueFromArray: function (arr) {
      var obj = {};
      arr.forEach(function (item) {
        obj[item.toString()] = true;
      });
      return Object.keys(obj).map(function (key) {
        return key;
      });
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
    },

    getRandomAvatar: function () {
      return 'img/avatar-' + getRandomFromRange(1, 6) + '.svg';
    }
  };
})();
