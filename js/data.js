'use strict';

(function () {
  var OBJECT_AMOUNT = 25;
  var LIKES_AMOUNT_MIN = 15;
  var LIKES_AMOUNT_MAX = 200;
  var COMMENTS_JOIN_MIN = 1;
  var COMMENTS_JOIN_MAX = 2;
  var COMMENTS_AMOUNT_MIN = 0;
  var COMMENTS_AMOUNT_MAX = 22;

  var COMMENTS = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var DESCRIPTIONS = ['Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'];

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomFromArray = function (arr) {
    return arr[getRandomFromRange(1, arr.length) - 1];
  };

  var getRandomLimitedSetFromArray = function (arr, setLength) {
    var reSortedArray = window.common.shuffleArray(arr);
    reSortedArray.length = Math.min(setLength, reSortedArray.length);
    return reSortedArray;
  };

  var getToStringConvertedArray = function (arr, delimiter) {
    return (arr.length === 0) ? '' : arr.join(delimiter);
  };

  var getRandomComplexArray = function (sourceArray, arrayLength, joinMin, joinMax) {
    var arr = [];
    for (var i = 0; i < arrayLength; i++) {
      arr[i] = getToStringConvertedArray(getRandomLimitedSetFromArray(sourceArray, getRandomFromRange(joinMin, joinMax)), ' ');
    }
    return arr;
  };

  window.data = {
    generateObjectArray: function () {
      var dataArray = [];
      for (var i = 0; i < OBJECT_AMOUNT; i++) {
        dataArray[i] = {};
        dataArray[i]['url'] = 'photos/' + (i + 1) + '.jpg';
        dataArray[i]['likes'] = getRandomFromRange(LIKES_AMOUNT_MIN, LIKES_AMOUNT_MAX);
        dataArray[i]['comments'] = getRandomComplexArray(COMMENTS, getRandomFromRange(COMMENTS_AMOUNT_MIN, COMMENTS_AMOUNT_MAX), COMMENTS_JOIN_MIN, COMMENTS_JOIN_MAX);
        dataArray[i]['description'] = getRandomFromArray(DESCRIPTIONS);
        dataArray[i]['id'] = 'id-' + i;
      }
      return dataArray;
    },

    getRandomAvatar: function () {
      return 'img/avatar-' + getRandomFromRange(1, 6) + '.svg';
    }
  };
})();
