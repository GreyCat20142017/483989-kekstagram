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
  var ZOOM_DEFAULT_VALUE = 100;
  var ZOOM_MIN = 25;
  var ZOOM_MAX = 100;
  var ZOOM_STEP = 25;
  var PIN_KEYBOARD_STEP = 5;
  var NO_ESCAPE_NAMES = ['hashtags', 'description'];
  var HASH_TAG_MIN_LENGTH = 2;
  var HASH_TAG_MAX_LENGTH = 20;
  var HASH_TAG_MAX_AMOUNT = 5;
  var DESCRIPTION_MAX_LENGTH = 140;
  var EFFECT_PREVIEW_PREFIX = 'effects__preview--';
  var NEED_DEFAULT_STATE = true;
  var effectPreviewClasses = Object.keys(EFFECTS).map(function (item) {
    return EFFECT_PREVIEW_PREFIX + item;
  });

  var init = function (links, messages) {

    var getHashTagsValidationResults = function (items) {
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
      items.forEach(function (item) {
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

      if (items.length > window.common.getUniqueFromArray(items).length) {
        validationResult.push(commonTagRules['doubleDetected'].errorMessage);
      }

      if (window.common.getUniqueFromArray(items).length > HASH_TAG_MAX_AMOUNT) {
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
      links.formInputs.forEach(function (item) {
        result = result && item.validity.valid;
      });
      return result;
    };

    var resetFormInputs = function () {
      links.formInputs.forEach(function (item) {
        item.value = '';
      });
      links.uploadFile.value = '';
    };

    var onCancelButtonClick = function (evt) {
      window.general.isEvent(evt, hideForm);
    };

    var onDocumentKeyDown = function (evt) {
      window.general.isEscEvent(evt, hideForm);
    };

    var showForm = function () {
      if (links.formOverlay) {
        if (NEED_DEFAULT_STATE) {
          setDefaultState();
        }
        changeScaleValue();
        setFormInteractivity();
        window.general.removeClassName(links.formOverlay, 'hidden');
        var currentEffect = links.formOverlay.querySelector(CURRENT_EFFECT_SELECTOR);
        if (currentEffect) {
          applyEffect(currentEffect.value);
          changeEffectLevelStyles();
        }
        window.general.resetTabIndex(window.general.getMaxTabIndex(), links.formOverlayInteractiveItems);
        links.formCancel.tabIndex = window.general.getIncreasedTabIndex();
        window.general.setFocusOnObject(links.formCancel);
      }
    };

    var hideForm = function () {
      if (links.formOverlay) {
        if (NO_ESCAPE_NAMES.indexOf(document.activeElement.name) !== -1) {
          return false;
        }
        removeFormInteractivity();
        resetFormInputs();
        window.general.resetTabIndex(window.general.getDefaultTabIndex(), links.formOverlayInteractiveItems);
        window.general.addClassName(links.formOverlay, 'hidden');
        window.general.setFocusOnObject(links.uploadFile);
      }
      return false;
    };

    var onFormTabKeyDown = function (evt) {
      window.general.isOverlayTabEvent(evt, links.formCancel, links.formSubmit);
    };

    var switchFormInteractivity = function (action) {
      document[action]('keydown', onDocumentKeyDown);
      if (links.form) {
        links.form[action]('submit', onSubmit);
        links.form[action]('change', onFormChange);
        links.form[action]('keydown', onFormTabKeyDown);
        if (links.formCancel) {
          links.formCancel[action]('click', onCancelButtonClick);
        }
        if (links.formPin) {
          links.formPin[action]('mousedown', onPinMouseDown);
          links.formPin[action]('keydown', onPinKeyDown);
        }
        if (formZoomer && links.formScaleDecrease && links.formScaleIncrease && links.formScaleValue) {
          links.formScaleDecrease[action]('click', onDecreaseClick);
          links.formScaleIncrease[action]('click', onIncreaseClick);
        }
      }
    };

    var setFormInteractivity = function () {
      switchFormInteractivity('addEventListener');
    };

    var removeFormInteractivity = function () {
      switchFormInteractivity('removeEventListener');
    };

    var setDefaultState = function () {
      if (links.formEffectDefault) {
        links.formEffectDefault.checked = true;
      }
      setEffectLevelValue(DEFAULT_EFFECT_LEVEL);
      applyEffect(DEFAULT_EFFECT_NAME);
    };

    var changeScaleValue = function () {
      if (links.formScaleValue) {
        links.formScaleValue.value = ((formZoomer) ? formZoomer.getValue() : ZOOM_DEFAULT_VALUE) + '%';
        setStyleByScaleValue();
      }
    };

    var setStyleByScaleValue = function () {
      if (links.formScaleValue && links.formImgPreview) {
        links.formImgPreview.parentElement.style.transform = 'scale(' + parseInt(links.formScaleValue.value, 10) / 100 + ')';
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
      if (links.formEffectLevel) {
        links.formEffectLevel.value = Math.round(100 * percent) / 100;
      }
    };

    var getEffectLevelValue = function (element) {
      if (element) {
        return parseInt(element.value, 10);
      }
      return DEFAULT_EFFECT_LEVEL;
    };

    var changeEffectLevelStyles = function () {
      if (links.formPin && links.formEffectLevel && links.formEffectDepth) {
        var levelValue = getEffectLevelValue(links.formEffectLevel);
        links.formPin.style.left = levelValue + '%';
        links.formEffectDepth.style.width = levelValue + '%';
        setStyleByEffectLevel(links.formImgPreview, getCurrentEffect(), levelValue);
      }
    };

    var getCurrentEffect = function () {
      var currentEffect = window.dom.getElementBySelector(links.form, CURRENT_EFFECT_SELECTOR);
      return (currentEffect) ? currentEffect.value : DEFAULT_EFFECT_NAME;
    };

    var refreshKeyboardSliderState = function (isNeedDecrease) {
      var lineWidth = links.formPin.parentElement.offsetWidth;
      var newX = links.formPin.offsetLeft + (isNeedDecrease ? (-1) : 1) * PIN_KEYBOARD_STEP * lineWidth / 100;
      var sliderValue = window.common.getLimitedValue(newX, 0, lineWidth) / lineWidth * 100;
      setEffectLevelValue(sliderValue);
      changeEffectLevelStyles();
    };

    var onPinKeyDown = function (evt) {
      window.general.isArrowEvent(evt, refreshKeyboardSliderState);
    };

    var onPinMouseDown = function (evt) {
      var refreshSliderState = function (moveUpEvt) {
        var newX = moveUpEvt.pageX - shiftX - sliderX;
        var lineWidth = links.formPin.parentElement.offsetWidth;
        var sliderValue = window.common.getLimitedValue(newX, 0, lineWidth) / lineWidth * 100;
        setEffectLevelValue(sliderValue);
        changeEffectLevelStyles();
      };

      var onPinMouseUp = function (upEvt) {
        if (links.formPin) {
          refreshSliderState(upEvt);
          document.removeEventListener('mouseup', onPinMouseUp);
          document.removeEventListener('mousemove', onPinMouseMove);
        }
      };

      var onPinMouseMove = function (moveEvt) {
        refreshSliderState(moveEvt);
      };

      if (links.formPin) {
        var sliderX = window.dom.getXCoordinate(links.formPin.parentElement);
        var pinX = window.dom.getXCoordinate(links.formPin);
        var shiftX = evt.pageX - pinX;
        evt.preventDefault();
        document.addEventListener('mouseup', onPinMouseUp);
        document.addEventListener('mousemove', onPinMouseMove);
      }
    };

    var applyEffect = function (effect) {
      if (links.formImgPreview && links.formEffectLevel && links.formPin) {
        window.dom.removeAlternatives(links.formImgPreview, effectPreviewClasses);
        if (effect !== DEFAULT_EFFECT_NAME) {
          window.general.addClassName(links.formImgPreview, EFFECT_PREVIEW_PREFIX + effect);
          if (links.formEffectContainer) {
            window.general.removeClassName(links.formEffectContainer, 'visually-hidden');
            links.formPin.tabIndex = window.general.getMaxTabIndex();
          }
        } else {
          if (links.formEffectContainer) {
            window.general.addClassName(links.formEffectContainer, 'visually-hidden');
            links.formPin.tabIndex = window.general.getDisabledTabIndex();
          }
        }
        setStyleByEffectLevel(links.formImgPreview, effect, getEffectLevelValue(links.formEffectLevel));
      }
    };

    var onPostDataError = function (errorMessage) {
      hideForm();
      window.message.init(messages.errorMessage, errorMessage);
    };

    var onPostData = function () {
      hideForm();
      window.message.init(messages.successMessage);
    };

    var onSubmit = function (evt) {
      evt.preventDefault();
      var validationResult = getCustomValidationResult();
      if (validationResult) {
        if (window.backend) {
          window.backend.postData(new FormData(links.form), onPostData, onPostDataError);
        }
      }
    };

    var formZoomer = (window.zoomer) ? (new window.zoomer.Zoomer(ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, ZOOM_DEFAULT_VALUE)) : null;
    showForm();
  };

  window.form = {
    init: init
  };

})();
