'use strict';

(function () {
  var DEFAULT_EFFECT_LEVEL = 100;

  var form = window.links.editingFormLinks.form;
  var formPin = window.links.editingFormLinks.formPin;
  var formEffectLevel = window.links.editingFormLinks.formEffectLevel;
  var formEffectDepth = window.links.editingFormLinks.formEffectDepth;
  var formImgPreview = window.links.editingFormLinks.formImgPreview;

  var setEffectLevelValue = function (percent) {
    if (formEffectLevel) {
      formEffectLevel.setAttribute('value', Math.round(100 * percent) / 100);
    }
  };

  var getEffectLevelValue = function (elem) {
    if (elem) {
      if (!elem.hasAttribute('value')) {
        setEffectLevelValue(DEFAULT_EFFECT_LEVEL);
      }
      return elem.getAttribute('value');
    }
    return DEFAULT_EFFECT_LEVEL;
  };

  var changeEffectLevelStyles = function () {
    if (formPin && formEffectLevel && formEffectDepth) {
      var levelValue = getEffectLevelValue(formEffectLevel);
      formPin.style.left = levelValue + '%';
      formEffectDepth.style.width = levelValue + '%';
      window.general.setStyleByEffectLevel(formImgPreview, getCurrentEffect(), levelValue);
    }
  };

  var getCurrentEffect = function () {
    var currentEffect = window.dom.getElementBySelector(form, window.general.CURRENT_EFFECT_SELECTOR);
    return (currentEffect) ? currentEffect.value : window.general.DEFAULT_EFFECT_NAME;
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

  window.range = {
    setRangeInteractivity: function () {
      formPin.addEventListener('mousedown', onPinMouseDown);
    },

    removeRangeInteractivity: function () {
      formPin.addEventListener('mousedown', onPinMouseDown);
    },

    changeEffectLevelStyles: changeEffectLevelStyles,
    setEffectLevelValue: setEffectLevelValue,
    getEffectLevelValue: getEffectLevelValue
  };
})();
