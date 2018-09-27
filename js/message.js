'use strict';

(function () {
  var init = function (messageLink, messageTitle, hiddenButtons) {

    var show = function () {
      setMessageInteractivity();
      window.general.removeClassName(messageLink, 'visually-hidden');
    };

    var hide = function () {
      removeMessageInteractivity();
      window.general.addClassName(messageLink, 'visually-hidden');
    };

    var onButtonClick = function (evt) {
      window.events.isEvent(evt, hide);
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hide);
    };

    var onDocumentClick = function (evt) {
      if (!messageLink.children[0].contains(evt.target)) {
        window.events.isEvent(evt, hide);
      }
    };

    var setMessageInteractivity = function () {
      document.addEventListener('keydown', onDocumentKeyDown);
      document.addEventListener('click', onDocumentClick);
      if (messageLink) {
        Array.prototype.slice.call(buttons).forEach(function (btn) {
          btn.addEventListener('click', onButtonClick);
          if (hiddenButtons) {
            window.general.addClassName(btn, 'visually-hidden');
          }
        });
      }
    };

    var removeMessageInteractivity = function () {
      document.removeEventListener('keydown', onDocumentKeyDown);
      document.removeEventListener('click', onDocumentClick);
      if (messageLink) {
        Array.prototype.slice.call(buttons).forEach(function (btn) {
          btn.removeEventListener('click', onButtonClick);
          if (hiddenButtons) {
            window.general.removeClassName(btn, 'visually-hidden');
          }
        });
      }
    };

    var setMessageTitle = function (text) {
      var msgTitle = window.dom.getElementBySelector(messageLink, 'h2');
      if (msgTitle) {
        msgTitle.textContent = text;
      }
    };

    var buttons = messageLink.querySelectorAll('button');
    if (messageTitle) {
      setMessageTitle(messageTitle);
    }
    show();
  };

  window.message = {
    init: init
  };
})();
