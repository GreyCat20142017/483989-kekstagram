'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var LEFT_KEYCODE = 37;
  var RIGHT_KEYCODE = 39;
  var TAB_KEYCODE = 9;
  var DISABLED_TABINDEX = -1;
  var DEFAULT_TABINDEX = 0;
  var INCREASED_TABINDEX = 1;
  var MAX_TABINDEX = 2;

  var setFocusOnObject = function (interactiveObject) {
    if (interactiveObject) {
      interactiveObject.focus();
    }
  };

  window.general = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();
        action();
      }
    },

    isEvent: function (evt, action) {
      evt.preventDefault();
      action();
    },

    removeClassName: function (element, className) {
      if (element && element.classList.contains(className)) {
        element.classList.remove(className);
      }
    },

    addClassName: function (element, className) {
      if (element && !element.classList.contains(className)) {
        element.classList.add(className);
      }
    },

    setButtonsState: function (buttons, isDisabled) {
      if (buttons) {
        Array.prototype.slice.call(buttons).forEach(function (button) {
          button.disabled = isDisabled;
        });
      }
    },

    getDisabledTabIndex: function () {
      return DISABLED_TABINDEX;
    },

    getDefaultTabIndex: function () {
      return DEFAULT_TABINDEX;
    },

    getIncreasedTabIndex: function () {
      return INCREASED_TABINDEX;
    },

    getMaxTabIndex: function () {
      return MAX_TABINDEX;
    },

    resetTabIndex: function (newTabIndex, interactiveItems) {
      if (interactiveItems) {
        Array.prototype.slice.call(interactiveItems).forEach(function (item) {
          item.tabIndex = newTabIndex;
        });
      }
    },

    isOverlayTabEvent: function (evt, firstInteractiveObject, lastInteractiveObject) {
      if (evt.keyCode === TAB_KEYCODE) {
        if ((evt.target === firstInteractiveObject) && evt.shiftKey) {
          evt.preventDefault();
          setFocusOnObject(lastInteractiveObject);
        }
        if ((evt.target === lastInteractiveObject) && !evt.shiftKey) {
          evt.preventDefault();
          setFocusOnObject(firstInteractiveObject);
        }
      }
    },

    isArrowEvent: function (evt, action) {
      if (evt.keyCode === RIGHT_KEYCODE) {
        evt.preventDefault();
        action(false);
      }
      if (evt.keyCode === LEFT_KEYCODE) {
        evt.preventDefault();
        action(true);
      }
    },

    isPreventableTabEvent: function (evt) {
      if (evt.keyCode === TAB_KEYCODE) {
        evt.preventDefault();
      }
    },

    setFocusOnObject: setFocusOnObject

  };
})();
