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

  var EFFECTS = {'none': {},
    'chrome': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'grayscale'},
    'sepia': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'sepia'},
    'marvin': {scaleMin: 0, scaleMax: 100, unit: '%', filterName: 'invert'},
    'phobos': {scaleMin: 0, scaleMax: 3, unit: 'px', filterName: 'blur'},
    'heat': {scaleMin: 1, scaleMax: 3, unit: '', filterName: 'brightness'}
  };

  var EFFECT_PREVIEW_PREFIX = 'effects__preview--';
  var CURRENT_EFFECT_SELECTOR = 'input[name="effect"]:checked';


  var ESC_KEYCODE = 27;

  var PHOTO_KEY = 'data-id';

  var getRandomAvatar = function () {
    return 'img/avatar-' + getRandomFromRange(1, 6) + '.svg';
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
      dataArray[i]['id'] = 'id-' + i;
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

  var getElementBySelector = function (parentElement, selector) {
    if (parentElement) {
      return parentElement.querySelector(selector);
    }
    return false;
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

  var removeAlternatives = function (obj, classSet) {
    classSet.forEach(function (item) {
      removeClassName(obj, item);
    });
  };

  var getTemplateContent = function (templateSelector, contentSelector) {
    var templateBySelector = document.querySelector(templateSelector);
    if (templateBySelector) {
      return templateBySelector.content.querySelector(contentSelector);
    }
    return false;
  };

  var renderComments = function (parent, comments) {

    var createComment = function (template, comment) {
      var element = template.cloneNode(true);
      setAttributeBySelector(element, '.social__picture', 'src', getRandomAvatar());
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
    if (bigPhoto) {
      fillPictureBasicData(['.big-picture__img > img', '.likes-count', '.comments-count'], bigPhoto, data);
      setAttributeBySelector(bigPhoto, '.social__caption', 'textContent', data.description);
      renderComments(bigPhoto, data.comments);

      if (totalComments) {
        var markup = totalComments.innerHTML;
        markup = markup.replace(/\d*\sиз\s/, Math.min(data.comments.length, COMMENTS_AMOUNT_IN_MARKUP) + ' из ');
        totalComments.innerHTML = markup;
      }

      addClassNameBySelector(bigPhoto, '.social__comment-count', 'visually-hidden');
      addClassNameBySelector(bigPhoto, '.comments-loader', 'visually-hidden');
    }
  };

  var renderPhotos = function (dataArray) {

    var createPhoto = function (template, data) {
      var element = template.cloneNode(true);
      fillPictureBasicData(['.picture__img', '.picture__likes', '.picture__comments'], element, data);
      element.setAttribute(PHOTO_KEY, data.id);
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


  var onCancelButtonClick = function (evt) {
    evt.preventDefault();
    hideEditingForm();
  };

  var onEditingDocumentKeyDown = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      hideEditingForm();
    }
  };

  var onUploadFileChange = function (evt) {
    evt.preventDefault();
    showEditingForm();
  };

  var onPinMouseUp = function (evt) {
    refreshEffectLevel(evt.target.offsetLeft);
  };

  var refreshEffectLevel = function (pinOffsetLeft) {
    var currentEffect = getElementBySelector(editingForm, CURRENT_EFFECT_SELECTOR);
    setEffectLevel(pinOffsetLeft);
    if (currentEffect && editingFormImgPreview && editingFormEffectLevel) {
      setStyleByEffectLevel(editingFormImgPreview, currentEffect.value, editingFormEffectLevel.value);
    }
  };

  var setEffectLevel = function (pinOffsetLeft) {
    if (editingFormEffectLevel) {
      editingFormEffectLevel.value = getEffectLevel(pinOffsetLeft);
    }
  };

  var getEffectLevel = function (pinOffsetLeft) {
    var power = 0;
    if (editingFormPin && editingFormPin.parentElement) {
      power = calculateEffectPower(pinOffsetLeft, editingFormPin.parentElement.clientWidth);
    }
    return power;
  };

  var calculateEffectPower = function (pinX, lineWidth) {
    return (lineWidth) === 0 ? 0 : Math.round(pinX / lineWidth * 100);
  };

  var showEditingForm = function () {
    if (editingForm) {
      setEditingFormInteractivity();
      removeClassName(editingForm, 'hidden');
      setEffectLevel(editingFormPin.offsetLeft);
      var currentEffect = editingForm.querySelector(CURRENT_EFFECT_SELECTOR);
      if (currentEffect) {
        applyEffect(currentEffect.value);
      }
    }
  };

  var hideEditingForm = function () {
    if (editingForm) {
      removeEditingFormInteractivity();
      clearUploadFileValue();
      addClassName(editingForm, 'hidden');
    }
  };

  var setEditingFormInteractivity = function () {
    document.addEventListener('keydown', onEditingDocumentKeyDown);
    if (editingFormCancel) {
      editingFormCancel.addEventListener('click', onCancelButtonClick);
    }
    if (editingForm && editingFormPin) {
      editingFormPin.addEventListener('mouseup', onPinMouseUp);
      editingForm.addEventListener('change', onEffectsChange);
    }
  };

  var removeEditingFormInteractivity = function () {
    document.removeEventListener('keydown', onEditingDocumentKeyDown);
    if (editingFormCancel) {
      editingFormCancel.removeEventListener('click', onCancelButtonClick);
    }
    if (editingForm && editingFormPin) {
      editingFormPin.removeEventListener('mouseup', onPinMouseUp);
      editingFormEffects.removeEventListener('change', onEffectsChange);
    }
  };

  var clearUploadFileValue = function () {
    uploadFile.value = '';
  };

  var onEffectsChange = function (evt) {
    var el = evt.target;
    if (el.name === 'effect' && el.tagName === 'INPUT') {
      applyEffect(el.value);
    }
    return false;
  };

  var applyEffect = function (effect) {
    if (editingFormImgPreview && editingFormEffectLevel) {
      removeAlternatives(editingFormImgPreview, effectPreviewClasses);
      if (!(effect === 'none')) {
        addClassName(editingFormImgPreview, EFFECT_PREVIEW_PREFIX + effect);
      }
      setStyleByEffectLevel(editingFormImgPreview, effect, editingFormEffectLevel.value);
    }
  };

  var setStyleByEffectLevel = function (element, effect, level) {
    element.style = 'filter: ' + getFilterText(effect, level) + '; ' +
    '-webkit-filter: ' + getFilterText(effect, level) + '; ';
  };

  var getFilterText = function (effect, level) {
    var filterText = 'none';
    var params = EFFECTS[effect];
    if (effect === 'none') {
      return filterText;
    }
    if (params) {
      filterText = params.filterName + '(' + getLevelByScale(params.scaleMin, params.scaleMax, level) + params.unit + ')';
    }
    return filterText;
  };

  var getLevelByScale = function (min, max, level) {
    return Math.round(100 * (min + level * (max - min) / 100)) / 100;
  };

  var onBigCancelButtonClick = function (evt) {
    evt.preventDefault();
    hideBigPhoto();
  };

  var onBigDocumentKeyDown = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      hideBigPhoto();
    }
  };

  var showBigPhoto = function (data) {
    if (bigPhoto) {
      setBigPhotoInteractivity();
      renderBigPhoto(data);
      removeClassName(bigPhoto, 'hidden');
    }
  };

  var hideBigPhoto = function () {
    if (bigPhoto) {
      removeBigPhotoInteractivity();
      addClassName(bigPhoto, 'hidden');
    }
  };

  var setBigPhotoInteractivity = function () {
    document.addEventListener('keydown', onBigDocumentKeyDown);
    if (bigPhotoCancel) {
      bigPhotoCancel.addEventListener('click', onBigCancelButtonClick);
    }
  };

  var removeBigPhotoInteractivity = function () {
    document.removeEventListener('keydown', onBigDocumentKeyDown);
    if (bigPhotoCancel) {
      bigPhotoCancel.removeEventListener('click', onBigCancelButtonClick);
    }
  };

  var onPicturesClick = function (evt) {
    var el = evt.target;
    if (el.tagName.toUpperCase() !== 'IMG') {
      return false;
    }
    evt.preventDefault();
    while (el !== pictures) {
      if (el.hasAttribute(PHOTO_KEY)) {
        var index = photos.indexOf(photos.filter(function (item) {
          return item.id === el.getAttribute(PHOTO_KEY);
        })[0]);
        if ((index >= 0) && (index < photos.length)) {
          showBigPhoto(photos[index]);
        }
        return false;
      }
      el = el.parentNode;
    }
    return false;
  };


  var initForm = function () {
    renderPhotos(photos);
    if (uploadFile && editingForm && editingFormCancel) {
      uploadFile.addEventListener('change', onUploadFileChange);
    }
    if (pictures && bigPhoto && bigPhotoCancel) {
      pictures.addEventListener('click', onPicturesClick);
    }
  };

  var pictures = document.querySelector('.pictures');
  var pseudoTemplate = document.querySelector('.social__comment').cloneNode(true);
  var totalComments = document.querySelector('.social__comment-count');

  var uploadFile = getElementBySelector(pictures, '#upload-file');
  var editingForm = getElementBySelector(pictures, '.img-upload__overlay');
  var editingFormCancel = getElementBySelector(editingForm, '#upload-cancel');
  var editingFormPin = getElementBySelector(editingForm, '.effect-level__pin');
  var editingFormEffects = getElementBySelector(editingForm, CURRENT_EFFECT_SELECTOR);
  var editingFormEffectLevel = getElementBySelector(editingForm, '.effect-level__value');
  var editingFormImgPreview = getElementBySelector(editingForm, '.img-upload__preview > img');

  var bigPhoto = document.querySelector('.big-picture');
  var bigPhotoCancel = getElementBySelector(bigPhoto, '#picture-cancel');

  var photos = shuffleArray(generateObjectArray());

  var effectPreviewClasses = Object.keys(EFFECTS).map(function (item) {
    return EFFECT_PREVIEW_PREFIX + item;
  });

  initForm();

})();
