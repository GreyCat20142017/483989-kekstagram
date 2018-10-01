'use strict';

(function () {
  var EFFECTS = {'none': {},
    'chrome': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'grayscale'},
    'sepia': {scaleMin: 0, scaleMax: 1, unit: '', filterName: 'sepia'},
    'marvin': {scaleMin: 0, scaleMax: 100, unit: '%', filterName: 'invert'},
    'phobos': {scaleMin: 0, scaleMax: 3, unit: 'px', filterName: 'blur'},
    'heat': {scaleMin: 1, scaleMax: 3, unit: '', filterName: 'brightness'}
  };
  var CURRENT_EFFECT_SELECTOR = 'input[name="effect"]:checked';
  var DEFAULT_EFFECT_NAME = 'none';
  var DEFAULT_EFFECT_LEVEL = 100;
  var DEFAULT_SCALE_VALUE = 100;
  var NO_ESCAPE_NAMES = ['hashtags', 'description'];
  var HASH_TAG_MIN_LENGTH = 2;
  var HASH_TAG_MAX_LENGTH = 20;
  var HASH_TAG_MAX_AMOUNT = 5;
  var DESCRIPTION_MAX_LENGTH = 140;
  var EFFECT_PREVIEW_PREFIX = 'effects__preview--';
  var NEED_DEFAULT_STATE = true;

  var init = function (links, messages) {

    var effectPreviewClasses = Object.keys(EFFECTS).map(function (item) {
      return EFFECT_PREVIEW_PREFIX + item;
    });

    var getHashTagsValidationResults = function (sourceArr) {
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
      sourceArr.forEach(function (item) {
        if (item[0] !== '#') {
          validationResult.push(singleTagRules['needStartHash'].errorMessage);
        }
        if ((item[0] === '#') && (item.length) < HASH_TAG_MIN_LENGTH) {
          validationResult.push(singleTagRules['notOnlyHash'].errorMessage);
        }
        if ((item[0] === '#') && (item.length) > HASH_TAG_MAX_LENGTH) {
          validationResult.push(singleTagRules['maxLengthLimit'].errorMessage);
        }
        var hashesInTag = item.match(/#/g);
        if (Array.isArray(hashesInTag) ? (hashesInTag.length > 1) : false) {
          validationResult.push(singleTagRules['needSpace'].errorMessage);
        }
      });

      if (sourceArr.length > window.common.getUniqueFromArray(sourceArr).length) {
        validationResult.push(commonTagRules['doubleDetected'].errorMessage);
      }

      if (window.common.getUniqueFromArray(sourceArr).length > HASH_TAG_MAX_AMOUNT) {
        validationResult.push(commonTagRules['toManyTags'].errorMessage);
      }

      return window.common.getUniqueFromArray(validationResult);
    };

    var getValidationStyle = function (validationResult) {
      return validationResult ? 'none' : '0 2px 0 4px red';
    };

    var validateHashInput = function (element) {
      var hashTags = element.value.toLowerCase().split(' ').filter(function (item) {
        return item !== '';
      });
      var validationResult = getHashTagsValidationResults(hashTags);
      element.setCustomValidity((validationResult.length === 0) ? '' : validationResult.join(', '));
      element.style.boxShadow = getValidationStyle(element.validity.valid);
    };

    var validateDescriptionInput = function (element) {
      var validationResult = (element.validity.tooLong || (element.value.length > DESCRIPTION_MAX_LENGTH)) ?
        'длина комментария не может быть более ' + DESCRIPTION_MAX_LENGTH + ' символов' : '';
      element.setCustomValidity(validationResult);
      element.style.boxShadow = getValidationStyle(element.validity.valid);
    };

    var getCustomValidationResult = function () {
      var result = true;
      formInputs.forEach(function (item) {
        result = result && item.validity.valid;
      });
      return result;
    };

    var resetFormInputs = function () {
      formInputs.forEach(function (item) {
        item.value = '';
      });
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
        if (NEED_DEFAULT_STATE) {
          setDefaultState();
        }
        changeScaleValue();
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

    var switchFormInteractivity = function (action, pinInteractivity) {
      document[action]('keydown', onDocumentKeyDown);
      if (form) {
        form[action]('submit', onSubmit);
        form[action]('change', onFormChange);
        if (formCancel) {
          formCancel[action]('click', onCancelButtonClick);
        }
        if (formPin) {
          pinInteractivity();
        }
        if (formZoomer && formScaleDecrease && formScaleIncrease && formScaleValue) {
          formScaleDecrease[action]('click', onDecreaseClick);
          formScaleIncrease[action]('click', onIncreaseClick);
        }
      }
    };

    var setFormInteractivity = function () {
      switchFormInteractivity('addEventListener', setRangeInteractivity);
    };

    var removeFormInteractivity = function () {
      switchFormInteractivity('removeEventListener', removeRangeInteractivity);
    };

    var setDefaultState = function () {
      if (formEffectDefault) {
        formEffectDefault.checked = true;
      }
      setEffectLevelValue(DEFAULT_EFFECT_LEVEL);
      applyEffect(DEFAULT_EFFECT_NAME);
    };

    var changeScaleValue = function () {
      if (formScaleValue) {
        formScaleValue.value = ((formZoomer) ? formZoomer.getValue() : DEFAULT_SCALE_VALUE) + '%';
        setStyleByScaleValue();
      }
    };

    var setStyleByScaleValue = function () {
      if (formScaleValue && formImgPreview) {
        formImgPreview.parentElement.style.transform = 'scale(' + parseInt(formScaleValue.value, 10) / 100 + ')';
      }
    };

    var onDecreaseClick = function () {
      changeScaleValue(formZoomer.decrease());
    };

    var onIncreaseClick = function () {
      changeScaleValue(formZoomer.increase());
    };

    var onFormChange = function (evt) {
      var element = evt.target;
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        switch (element.name) {
          case 'effect':
            setEffectLevelValue(DEFAULT_EFFECT_LEVEL);
            applyEffect(element.value);
            changeEffectLevelStyles();
            setStyleByScaleValue();
            break;
          case 'hashtags':
            validateHashInput(element);
            break;
          case 'description':
            validateDescriptionInput(element);
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
      element.style['filter'] = getFilterText(effect, level);
      element.style['-webkit-filter'] = getFilterText(effect, level);
    };

    var setEffectLevelValue = function (percent) {
      if (formEffectLevel) {
        formEffectLevel.value = Math.round(100 * percent) / 100;
      }
    };

    var getEffectLevelValue = function (element) {
      if (element) {
        return parseInt(element.value, 10);
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
        var sliderX = window.dom.getXCoordinate(formPin.parentElement);
        var pinX = window.dom.getXCoordinate(formPin);
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
      formPin.removeEventListener('mousedown', onPinMouseDown);
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
      window.message.init(messages.successMessage);
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

    var uploadFile = links.uploadFile;
    var form = links.form;
    var formOverlay = links.formOverlay;
    var formCancel = links.formCancel;
    var formPin = links.formPin;
    var formEffectContainer = links.formEffectContainer;
    var formEffectLevel = links.formEffectLevel;
    var formEffectDepth = links.formEffectDepth;
    var formEffectDefault = links.formEffectDefault;
    var formImgPreview = links.formImgPreview;
    var formInputs = links.formInputs;
    var formScaleDecrease = links.formScaleDecrease;
    var formScaleIncrease = links.formScaleIncrease;
    var formScaleValue = links.formScaleValue;
    var formZoomer = (window.zoomer) ? (new window.zoomer.Zoomer(25, 100, 25, DEFAULT_SCALE_VALUE)) : null;

    show();
  };

  window.form = {
    showEditingForm: init
  };

})();
