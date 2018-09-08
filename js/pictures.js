'use strict';

(function () {

  var OBJECT_AMOUNT = 25;
  var LIKES_AMOUNT_MIN = 15;
  var LIKES_AMOUNT_MAX = 200;
  var COMMENTS_JOIN_MIN = 1;
  var COMMENTS_JOIN_MAX = 2;
  var COMMENTS_AMOUNT_MIN = 0;
  var COMMENTS_AMOUNT_MAX = 22;
  var COMMENTS_AMOUNT_IN_MARKUP = 5;
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

  var pseudoTemplate = document.querySelector('.social__comment').cloneNode(true);
  var totalComments = document.querySelector('.social__comment-count');

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

  var getRandomFromRange = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomFromArray = function (arr) {
    return arr[getRandomFromRange(1, arr.length) - 1];
  };

  var getRandomLimitedSetFromArray = function (arr, setLength) {
    var reSortedArray = shuffleArray(arr);
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

  var generateObjectArray = function () {
    var dataArray = [];
    for (var i = 0; i < OBJECT_AMOUNT; i++) {
      dataArray[i] = {};
      dataArray[i]['url'] = 'photos/' + (i + 1) + '.jpg';
      dataArray[i]['likes'] = getRandomFromRange(LIKES_AMOUNT_MIN, LIKES_AMOUNT_MAX);
      dataArray[i]['comments'] = getRandomComplexArray(COMMENTS, getRandomFromRange(COMMENTS_AMOUNT_MIN, COMMENTS_AMOUNT_MAX), COMMENTS_JOIN_MIN, COMMENTS_JOIN_MAX);
      dataArray[i]['description'] = getRandomFromArray(DESCRIPTIONS);
    }
    return dataArray;
  };

  var removeChildren = function (element) {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  };

  var removeClassName = function (obj, className) {
    if (obj.classList.contains(className)) {
      obj.classList.remove(className);
    }
  };

  var addClassName = function (obj, className) {
    if (!obj.classList.contains(className)) {
      obj.classList.add(className);
    }
  };

  var addClassNameBySelector = function (parentObj, selector, className) {
    var obj = parentObj.querySelector(selector);
    if (obj) {
      addClassName(obj, className);
    }
  };

  var fillPictureBasicData = function (classSelectors, element, data) {
    setAttributeBySelector(element, classSelectors[0], 'src', data.url);
    setAttributeBySelector(element, classSelectors[1], 'textContent', data.likes);
    setAttributeBySelector(element, classSelectors[2], 'textContent', data.comments.length);
  };

  var setAttributeBySelector = function (element, selector, attribute, value) {
    var el = element.querySelector(selector);
    if (el) {
      el[attribute] = value;
    }
  };

  var getTemplateContent = function (templateSelector, contentSelector) {
    var templateBySelector = document.querySelector(templateSelector);
    if (templateBySelector) {
      return templateBySelector.content.querySelector(contentSelector);
    }
    return undefined;
  };

  var renderComments = function (parent, comments) {

    var createComment = function (template, comment) {
      var element = template.cloneNode(true);
      setAttributeBySelector(element, '.social__picture', 'src', 'img/avatar-' + getRandomFromRange(1, 6) + '.svg');
      setAttributeBySelector(element, '.social__text', 'textContent', comment);
      return element;
    };

    var insertionPoint = parent.querySelector('.social__comments');
    if (insertionPoint && pseudoTemplate) {
      var template = pseudoTemplate.cloneNode(true);
      var fragment = document.createDocumentFragment();
      removeChildren(insertionPoint);
      if (comments.length > 0) {
        for (var i = 0; i < Math.min(comments.length, COMMENTS_AMOUNT_IN_MARKUP); i++) {
          fragment.appendChild(createComment(template, comments[i], comments.length));
        }
      }
      insertionPoint.appendChild(fragment);
    }
  };

  var renderBigPhoto = function (data) {
    var elementBig = document.querySelector('.big-picture');
    if (elementBig) {
      fillPictureBasicData(['.big-picture__img > img', '.likes-count', '.comments-count'], elementBig, data);
      setAttributeBySelector(elementBig, '.social__caption', 'textContent', data.description);
      renderComments(elementBig, data.comments);

      if (totalComments) {
        var markup = totalComments.innerHTML;
        markup = markup.replace(/\d*\sиз\s/, Math.min(data.comments.length, COMMENTS_AMOUNT_IN_MARKUP) + ' из ');
        totalComments.innerHTML = markup;
      }

      addClassNameBySelector(elementBig, '.social__comment-count', 'visually-hidden');
      addClassNameBySelector(elementBig, '.comments-loader', 'visually-hidden');

      removeClassName(elementBig, 'hidden');
    }
  };

  var renderPhotos = function (dataArray) {

    var createPhoto = function (template, data) {
      var element = template.cloneNode(true);
      fillPictureBasicData(['.picture__img', '.picture__likes', '.picture__comments'], element, data);
      return element;
    };

    var template = getTemplateContent('#picture', '.picture');
    var insertionPoint = document.querySelector('.pictures');

    if (template && insertionPoint) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < dataArray.length; i++) {
        fragment.appendChild(createPhoto(template, dataArray[i]));
      }
      insertionPoint.appendChild(fragment);
    }
  };

  var photos = shuffleArray(generateObjectArray());
  renderPhotos(photos);
  renderBigPhoto(photos[0]);
})();
