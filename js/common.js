'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var shuffleArray = function (entities) {
    var sortableEntities = entities.slice();
    for (var i = sortableEntities.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temporaryValue = sortableEntities[i];
      sortableEntities[i] = sortableEntities[j];
      sortableEntities[j] = temporaryValue;
    }
    return sortableEntities;
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
    getUniqueFromArray: function (entities) {
      var temporaryObject = {};
      entities.forEach(function (item) {
        temporaryObject[item.toString()] = true;
      });
      return Object.keys(temporaryObject).map(function (key) {
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

    getRandomLimitedSetFromArray: function (entities, setLength) {
      var reSortedEntities = shuffleArray(entities);
      reSortedEntities.length = Math.min(setLength, reSortedEntities.length);
      return reSortedEntities;
    },

    getPhotosByRank: function (entities) {
      var reSortedEntities = entities.slice().sort(function (firstItem, secondItem) {
        var rank = secondItem.comments.length - firstItem.comments.length;
        if (rank === 0) {
          rank = parseInt(secondItem.likes, 10) - parseInt(firstItem.likes, 10);
        }
        if (rank === 0) {
          rank = getStringCompareResult(firstItem.url, secondItem.url);
        }
        return rank;
      });
      return reSortedEntities;
    },

    debounce: function (action) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          action.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
