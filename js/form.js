'use strict';

(function () {
  var EFFECTS = {'none': {},
    'chrome': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'grayscale'},
    'sepia': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'sepia'},
    'marvin': {scaleMin: 0, scaleMax: 100, unit: '%', filterName: 'invert'},
    'phobos': {scaleMin: 0, scaleMax: 3, unit: 'px', filterName: 'blur'},
    'heat': {scaleMin: 1, scaleMax: 3, unit: '', filterName: 'brightness'}
  };
  var DEFAULT_EFFECT_NAME = 'none';
  var DEFAULT_EFFECT_LEVEL = 100;
  var CURRENT_EFFECT_SELECTOR = 'input[name="effect"]:checked';

  var NO_ESCAPE_NAMES = ['hashtags', 'description'];
  var HASH_TAG_MIN_LENGTH = 2;
  var HASH_TAG_MAX_LENGTH = 20;
  var HASH_TAG_MAX_AMOUNT = 5;
  var DESCRIPTION_MAX_LENGTH = 140;
  var EFFECT_PREVIEW_PREFIX = 'effects__preview--';

  var init = function (links, messages) {

    var effectPreviewClasses = Object.keys(EFFECTS).map(function (item) {
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

    var getValidationStyle = function (validationResult) {
      return validationResult ? 'none' : '0 2px 0 4px red';
    };

    var validateHashInput = function (el) {
      var hashTags = el.value.toLowerCase().split(' ');
      var validationResult = getHashTagsValidationResults(hashTags);
      el.setCustomValidity((validationResult.length === 0) ? '' : validationResult.join(', '));
      el.style.boxShadow = getValidationStyle(el.validity.valid);
    };

    var validateDescriptionInput = function (el) {
      var validationResult = (el.validity.tooLong || (el.value.length > DESCRIPTION_MAX_LENGTH)) ?
        'длина комментария не может быть более ' + DESCRIPTION_MAX_LENGTH + ' символов' : '';
      el.setCustomValidity(validationResult);
      el.style.boxShadow = getValidationStyle(el.validity.valid);
    };

    var getCustomValidationResult = function () {
      var result = true;
      for (var i = 0; i < formInputs.length; i++) {
        result = result && formInputs[i].validity.valid;
      }
      return result;
    };

    var resetFormInputs = function () {
      for (var i = 0; i < formInputs.length; i++) {
        formInputs[i].value = '';
      }
      uploadFile.value = '';
    };

    var onCancelButtonClick = function (evt) {
      window.events.isEvent(evt, hide);
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hide);
    };

    var show = function () {
      if (formOverlay) {
        setFormInteractivity();
        window.general.removeClassName(formOverlay, 'hidden');
        var currentEffect = formOverlay.querySelector(CURRENT_EFFECT_SELECTOR);
        if (currentEffect) {
          applyEffect(currentEffect.value);
          changeEffectLevelStyles();
        }
      }
    };

    var hide = function () {
      if (formOverlay) {
        if (NO_ESCAPE_NAMES.indexOf(document.activeElement.name) !== -1) {
          return false;
        }
        removeFormInteractivity();
        resetFormInputs();
        window.general.addClassName(formOverlay, 'hidden');
      }
      return false;
    };

    var setFormInteractivity = function () {
      document.addEventListener('keydown', onDocumentKeyDown);
      if (form) {
        form.addEventListener('submit', onSubmit);
        form.addEventListener('change', onFormChange);
        if (formCancel) {
          formCancel.addEventListener('click', onCancelButtonClick);
        }
        if (formPin) {
          setRangeInteractivity();
        }
      }
    };

    var removeFormInteractivity = function () {
      document.removeEventListener('keydown', onDocumentKeyDown);
      if (form) {
        form.removeEventListener('submit', onSubmit);
        form.removeEventListener('change', onFormChange);
        if (formCancel) {
          formCancel.removeEventListener('click', onCancelButtonClick);
        }
        if (formPin) {
          removeRangeInteractivity();
        }
      }
    };

    var onFormChange = function (evt) {
      var el = evt.target;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        switch (el.name) {
          case 'effect':
            setEffectLevelValue(100);
            applyEffect(el.value);
            changeEffectLevelStyles();
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
    };

    var getFilterText = function (effect, level) {
      var filterText = 'none';
      var params = EFFECTS[effect];
      if (effect === DEFAULT_EFFECT_NAME) {
        return filterText;
      }
      if (params) {
        filterText = params.filterName + '(' + window.common.getValueByScale(params.scaleMin, params.scaleMax, level) + params.unit + ')';
      }
      return filterText;
    };

    var setStyleByEffectLevel = function (element, effect, level) {
      element.style = 'filter: ' + getFilterText(effect, level) + '; ' +
      '-webkit-filter: ' + getFilterText(effect, level) + '; ';
    };

    var setEffectLevelValue = function (percent) {
      if (formEffectLevel) {
        formEffectLevel.value = Math.round(100 * percent) / 100;
      }
    };

    var getEffectLevelValue = function (elem) {
      if (elem) {
        return parseInt(elem.value, 10);
      }
      return DEFAULT_EFFECT_LEVEL;
    };

    var changeEffectLevelStyles = function () {
      if (formPin && formEffectLevel && formEffectDepth) {
        var levelValue = getEffectLevelValue(formEffectLevel);
        formPin.style.left = levelValue + '%';
        formEffectDepth.style.width = levelValue + '%';
        setStyleByEffectLevel(formImgPreview, getCurrentEffect(), levelValue);
      }
    };

    var getCurrentEffect = function () {
      var currentEffect = window.dom.getElementBySelector(form, CURRENT_EFFECT_SELECTOR);
      return (currentEffect) ? currentEffect.value : DEFAULT_EFFECT_NAME;
    };

    var onPinMouseDown = function (evt) {
      var refreshSliderState = function (moveUpEvt) {
        var newX = moveUpEvt.pageX - shiftX - sliderX;
        var lineWidth = formPin.parentElement.offsetWidth;
        var sliderValue = window.common.getLimitedValue(newX, 0, lineWidth) / lineWidth * 100;
        setEffectLevelValue(sliderValue);
        changeEffectLevelStyles();
      };

      var onPinMouseUp = function (upEvt) {
        if (formPin) {
          refreshSliderState(upEvt);
          document.removeEventListener('mouseup', onPinMouseUp);
          document.removeEventListener('mousemove', onPinMouseMove);
        }
      };

      var onPinMouseMove = function (moveEvt) {
        refreshSliderState(moveEvt);
      };

      if (formPin) {
        var sliderX = window.dom.getXCoord(formPin.parentElement);
        var pinX = window.dom.getXCoord(formPin);
        var shiftX = evt.pageX - pinX;
        evt.preventDefault();
        document.addEventListener('mouseup', onPinMouseUp);
        document.addEventListener('mousemove', onPinMouseMove);
      }
    };

    var setRangeInteractivity = function () {
      formPin.addEventListener('mousedown', onPinMouseDown);
    };

    var removeRangeInteractivity = function () {
      formPin.addEventListener('mousedown', onPinMouseDown);
    };

    var applyEffect = function (effect) {
      if (formImgPreview && formEffectLevel) {
        window.dom.removeAlternatives(formImgPreview, effectPreviewClasses);
        if (effect !== DEFAULT_EFFECT_NAME) {
          window.general.addClassName(formImgPreview, EFFECT_PREVIEW_PREFIX + effect);
          if (formEffectContainer) {
            window.general.removeClassName(formEffectContainer, 'visually-hidden');
          }
        } else {
          if (formEffectContainer) {
            window.general.addClassName(formEffectContainer, 'visually-hidden');
          }
        }
        setStyleByEffectLevel(formImgPreview, effect, getEffectLevelValue(formEffectLevel));
      }
    };

    var onPostError = function (errorMessage) {
      hide();
      window.message.init(messages.errorMessage, errorMessage);
    };

    var onPost = function () {
      hide();
      window.message.init(messages.successMessage, 'Ура! Привет от озерных водяных!');
    };

    var onSubmit = function (evt) {
      evt.preventDefault();
      var validationResult = getCustomValidationResult();
      if (validationResult) {
        if (window.backend) {
          window.backend.postData(new FormData(form), onPost, onPostError);
        }
      }
    };

    var form = links.form;
    var formOverlay = links.formOverlay;
    var formCancel = links.formCancel;
    var formPin = links.formPin;
    var formEffectContainer = links.formEffectContainer;
    var formEffectLevel = links.formEffectLevel;
    var formEffectDepth = links.formEffectDepth;
    var formImgPreview = links.formImgPreview;
    var formInputs = links.formInputs;
    var uploadFile = links.uploadFile;
    show();
  };

  window.form = {
    showEditingForm: init
  };

})();
