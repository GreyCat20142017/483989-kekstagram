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
  var CURRENT_EFFECT_SELECTOR = 'input[name="effect"]:checked';

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

  window.general = {

    removeClassName: function (obj, className) {
      if (obj && obj.classList.contains(className)) {
        obj.classList.remove(className);
      }
    },

    addClassName: function (obj, className) {
      if (obj && !obj.classList.contains(className)) {
        obj.classList.add(className);
      }
    },

    setStyleByEffectLevel: function (element, effect, level) {
      element.style = 'filter: ' + getFilterText(effect, level) + '; ' +
      '-webkit-filter: ' + getFilterText(effect, level) + '; ';
    },

    EFFECTS: EFFECTS,
    CURRENT_EFFECT_SELECTOR: CURRENT_EFFECT_SELECTOR,
    DEFAULT_EFFECT_NAME: DEFAULT_EFFECT_NAME

  };
})();
