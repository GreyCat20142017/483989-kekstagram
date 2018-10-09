'use strict';

(function () {
  var init = function (messageLink, messageTitle, hiddenButtons) {

    var showMessage = function () {
      setMessageInteractivity();
      window.general.removeClassName(messageLink, 'visually-hidden');
    };

    var hideMessage = function () {
      removeMessageInteractivity();
      window.general.addClassName(messageLink, 'visually-hidden');
    };

    var onButtonClick = function (evt) {
      window.general.isEvent(evt, hideMessage);
    };

    var onDocumentKeyDown = function (evt) {
      window.general.isEscEvent(evt, hideMessage);
    };

    var onDocumentClick = function (evt) {
      if (!messageLink.children[0].contains(evt.target)) {
        window.general.isEvent(evt, hideMessage);
      }
    };

    var onOverlayTabKeyDown = function (evt) {
      window.general.isOverlayTabEvent(evt, buttons[0], buttons[buttons.length - 1]);
    };

    var onSingleButtonTabKeyDown = function (evt) {
      window.general.isPreventableTabEvent(evt);
    };

    var switchMessageInteractivity = function (action, additionalAction) {
      document[action]('keydown', onDocumentKeyDown);
      document[action]('click', onDocumentClick);
      if (messageLink) {
        Array.prototype.slice.call(buttons).forEach(function (button) {
          button[action]('click', onButtonClick);
          if (hiddenButtons) {
            window.general[additionalAction](button, 'visually-hidden');
          } else {
            if (buttons.length === 1) {
              buttons[0][action]('keydown', onSingleButtonTabKeyDown);
            } else {
              messageLink[action]('keydown', onOverlayTabKeyDown);
            }
          }
        });
      }
    };

    var setMessageInteractivity = function () {
      switchMessageInteractivity('addEventListener', 'addClassName');
      window.general.setButtonsState(buttons, false);
      if (!hiddenButtons && buttons.length > 0) {
        window.general.setFocusOnObject(buttons[0]);
      }
    };

    var removeMessageInteractivity = function () {
      switchMessageInteractivity('removeEventListener', 'addClassName');
      window.general.setButtonsState(buttons, true);
    };

    var setMessageTitle = function (text) {
      var messageText = window.dom.getElementBySelector(messageLink, 'h2');
      if (messageText) {
        messageText.textContent = text;
      }
    };

    var buttons = messageLink.querySelectorAll('button');
    if (messageTitle) {
      setMessageTitle(messageTitle);
    }
    showMessage();
  };

  window.message = {
    init: init
  };
})();
