'use strict';

(function () {
  window.dom = {
    getXCoord: function (elem) {
      return elem.getBoundingClientRect().x;
    },

    setAttributeBySelector: function (element, selector, attribute, value) {
      var el = element.querySelector(selector);
      if (el) {
        el[attribute] = value;
      }
    },

    removeAlternatives: function (obj, classSet) {
      classSet.forEach(function (item) {
        window.general.removeClassName(obj, item);
      });
    },

    getTemplateContent: function (templateSelector, contentSelector) {
      var templateBySelector = document.querySelector(templateSelector);
      if (templateBySelector) {
        return templateBySelector.content.querySelector(contentSelector);
      }
      return false;
    },

    removeChildren: function (element) {
      while (element.lastChild) {
        element.removeChild(element.lastChild);
      }
    },

    addClassNameBySelector: function (parentObj, selector, className) {
      var obj = parentObj.querySelector(selector);
      if (obj) {
        window.general.addClassName(obj, className);
      }
    },

    getElementBySelector: function (parentElement, selector) {
      if (parentElement) {
        return parentElement.querySelector(selector);
      }
      return false;
    }
  };
})();
