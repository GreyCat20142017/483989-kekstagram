'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var shuffleArray = function (arr) {
    var array = arr.slice();
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  var getStringCompareResult = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
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
    },

    getRandomLimitedSetFromArray: function (arr, setLength) {
      var reSortedArray = shuffleArray(arr);
      reSortedArray.length = Math.min(setLength, reSortedArray.length);
      return reSortedArray;
    },

    getPhotosByRank: function (arr) {
      var reSortedArray = arr.slice().sort(function (firstItem, secondItem) {
        var rank = (firstItem.comments && secondItem.comments) ? (secondItem.comments.length - firstItem.comments.length) : 0;
        if (rank === 0) {
          rank = (firstItem.likes && secondItem.likes) ? (parseInt(secondItem.likes, 10) - parseInt(firstItem.likes, 10)) : 0;
        }
        if (rank === 0) {
          rank = (firstItem.url && secondItem.url) ? getStringCompareResult(firstItem.url, secondItem.url) : 0;
        }
        return rank;
      });
      return reSortedArray;
    },

    debounce: function (action) {
      var lastTimeout = null;
      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          action.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }

  };
})();
