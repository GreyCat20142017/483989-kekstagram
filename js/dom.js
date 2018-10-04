'use strict';

(function () {
  window.dom = {
    getXCoordinate: function (element) {
      return element.getBoundingClientRect().left;
    },

    setAttributeBySelector: function (parentObject, selector, attribute, value) {
      var descendantObject = parentObject.querySelector(selector);
      if (descendantObject) {
        descendantObject[attribute] = value;
      }
    },

    removeAlternatives: function (element, classSet) {
      classSet.forEach(function (classItem) {
        window.general.removeClassName(element, classItem);
      });
    },

    getTemplateContent: function (templateSelector, contentSelector) {
      var templateBySelector = document.querySelector(templateSelector);
      if (templateBySelector) {
        return templateBySelector.content.querySelector(contentSelector);
      }
      return false;
    },

    removeChildren: function (parentObject) {
      while (parentObject.lastChild) {
        parentObject.removeChild(parentObject.lastChild);
      }
    },

    addClassNameBySelector: function (parentObject, selector, className) {
      var descendantObject = parentObject.querySelector(selector);
      if (descendantObject) {
        window.general.addClassName(descendantObject, className);
      }
    },

    removeClassNameBySelector: function (parentObject, selector, className) {
      var descendantObject = parentObject.querySelector(selector);
      if (descendantObject) {
        window.general.removeClassName(descendantObject, className);
      }
    },

    getElementBySelector: function (parentObject, selector) {
      if (parentObject) {
        return parentObject.querySelector(selector);
      }
      return false;
    }
  };
})();
