'use strict';

(function () {
  window.dom = {
    getXCoordinate: function (element) {
      return element.getBoundingClientRect().x;
    },

    setAttributeBySelector: function (parentElement, selector, attribute, value) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        descendantElement[attribute] = value;
      }
    },

    removeAlternatives: function (element, classSet) {
      classSet.forEach(function (item) {
        window.general.removeClassName(element, item);
      });
    },

    getTemplateContent: function (templateSelector, contentSelector) {
      var templateBySelector = document.querySelector(templateSelector);
      if (templateBySelector) {
        return templateBySelector.content.querySelector(contentSelector);
      }
      return false;
    },

    removeChildren: function (parentElement) {
      while (parentElement.lastChild) {
        parentElement.removeChild(parentElement.lastChild);
      }
    },

    addClassNameBySelector: function (parentElement, selector, className) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        window.general.addClassName(descendantElement, className);
      }
    },

    removeClassNameBySelector: function (parentElement, selector, className) {
      var descendantElement = parentElement.querySelector(selector);
      if (descendantElement) {
        window.general.removeClassName(descendantElement, className);
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
