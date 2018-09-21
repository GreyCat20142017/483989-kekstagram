'use strict';

(function () {
  var NO_ESCAPE_NAMES = ['hashtags', 'description'];
  var HASH_TAG_MIN_LENGTH = 2;
  var HASH_TAG_MAX_LENGTH = 20;
  var HASH_TAG_MAX_AMOUNT = 5;
  var DESCRIPTION_MAX_LENGTH = 140;
  var EFFECT_PREVIEW_PREFIX = 'effects__preview--';

  var form = window.links.editingFormLinks.form;
  var formCancel = window.links.editingFormLinks.formCancel;
  var formPin = window.links.editingFormLinks.formPin;
  var formEffectContainer = window.links.editingFormLinks.formEffectContainer;
  var formEffectLevel = window.links.editingFormLinks.formEffectLevel;
  var formImgPreview = window.links.editingFormLinks.formImgPreview;
  var uploadFile = window.links.editingFormLinks.uploadFile;

  var effectPreviewClasses = Object.keys(window.general.EFFECTS).map(function (item) {
    return EFFECT_PREVIEW_PREFIX + item;
  });

  var getHashTagsValidationResults = function (arr) {
    var singleTagRules = {
      'needStartHash': {errorMessage: 'хэш-тег должен начинаться с символа # (решётка)'},
      'notOnlyHash': {errorMessage: 'хеш-тег не может состоять только из одной решётки'},
      'maxLengthLimit': {errorMessage: 'максимальная длина одного хэш-тега 20 символов, включая решётку'},
      'needSpace': {errorMessage: 'хеш-теги должны разделяться пробелами'}
    };
    var commonTagRules = {
      'doubleDetected': {errorMessage: 'один хэш-тег не может быть использован дважды (регистр не учитывается)'},
      'toManyTags': {errorMessage: 'нельзя указать больше пяти хэш-тегов'}
    };

    var validationResult = [];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] !== '#') {
        validationResult.push(singleTagRules['needStartHash'].errorMessage);
      }
      if ((arr[i][0] === '#') && (arr[i].length) < HASH_TAG_MIN_LENGTH) {
        validationResult.push(singleTagRules['notOnlyHash'].errorMessage);
      }
      if ((arr[i][0] === '#') && (arr[i].length) > HASH_TAG_MAX_LENGTH) {
        validationResult.push(singleTagRules['maxLengthLimit'].errorMessage);
      }
      var hashesInTag = arr[i].match(/#/g);
      if (Array.isArray(hashesInTag) ? (hashesInTag.length > 1) : false) {
        validationResult.push(singleTagRules['needSpace'].errorMessage);
      }
    }

    if (arr.length > window.common.getUniqueFromArray(arr).length) {
      validationResult.push(commonTagRules['doubleDetected'].errorMessage);
    }

    if (window.common.getUniqueFromArray(arr).length > HASH_TAG_MAX_AMOUNT) {
      validationResult.push(commonTagRules['toManyTags'].errorMessage);
    }

    return window.common.getUniqueFromArray(validationResult);
  };

  var validateHashInput = function (el) {
    var hashTags = el.value.toLowerCase().split(' ');
    var validationResult = getHashTagsValidationResults(hashTags);
    el.setCustomValidity((validationResult.length === 0) ? '' : validationResult.join(', '));
  };

  var validateDescriptionInput = function (el) {
    var validationResult = (el.validity.tooLong || (el.value.length > DESCRIPTION_MAX_LENGTH)) ?
      'длина комментария не может быть более ' + DESCRIPTION_MAX_LENGTH + ' символов' : '';
    el.setCustomValidity(validationResult);
  };

  var onCancelButtonClick = function (evt) {
    window.events.isEvent(evt, hide);
  };

  var onDocumentKeyDown = function (evt) {
    window.events.isEscEvent(evt, hide);
  };

  var show = function () {
    if (form) {
      setFormInteractivity();
      window.general.removeClassName(form, 'hidden');
      var currentEffect = form.querySelector(window.general.CURRENT_EFFECT_SELECTOR);
      if (currentEffect) {
        applyEffect(currentEffect.value);
        window.range.changeEffectLevelStyles();
      }
    }
  };

  var hide = function () {
    if (form) {
      if (NO_ESCAPE_NAMES.indexOf(document.activeElement.name) !== -1) {
        return false;
      }
      removeFormInteractivity();
      clearUploadFileValue();
      window.general.addClassName(form, 'hidden');
    }
    return true;
  };

  var setFormInteractivity = function () {
    document.addEventListener('keydown', onDocumentKeyDown);
    if (formCancel) {
      formCancel.addEventListener('click', onCancelButtonClick);
    }
    if (form && formPin) {
      window.range.setRangeInteractivity();
      form.addEventListener('change', onFormChange);
    }
  };

  var removeFormInteractivity = function () {
    document.removeEventListener('keydown', onDocumentKeyDown);
    if (formCancel) {
      formCancel.removeEventListener('click', onCancelButtonClick);
    }
    if (form && formPin) {
      window.range.removeRangeInteractivity();
      form.removeEventListener('change', onFormChange);
    }
  };

  var clearUploadFileValue = function () {
    uploadFile.value = '';
  };

  var onFormChange = function (evt) {
    var el = evt.target;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      switch (el.name) {
        case 'effect':
          window.range.setEffectLevelValue(100);
          applyEffect(el.value);
          window.range.changeEffectLevelStyles();
          break;
        case 'hashtags':
          validateHashInput(el);
          break;
        case 'description':
          validateDescriptionInput(el);
          break;
        default:
          break;
      }
    }
    return false;
  };

  var applyEffect = function (effect) {
    if (formImgPreview && formEffectLevel) {
      window.dom.removeAlternatives(formImgPreview, effectPreviewClasses);
      if (effect !== window.general.DEFAULT_EFFECT_NAME) {
        window.general.addClassName(formImgPreview, EFFECT_PREVIEW_PREFIX + effect);
        if (formEffectContainer) {
          window.general.removeClassName(formEffectContainer, 'visually-hidden');
        }
      } else {
        if (formEffectContainer) {
          window.general.addClassName(formEffectContainer, 'visually-hidden');
        }
      }
      window.general.setStyleByEffectLevel(formImgPreview, effect, window.range.getEffectLevelValue(formEffectLevel));
    }
  };

  window.form = {
    showEditingForm: show
  };

})();
