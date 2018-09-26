'use strict';

(function () {
  var COMMENTS_AMOUNT_IN_MARKUP = 5;

  var init = function (dataElement, links) {

    var hide = function () {
      if (form) {
        removeFormInteractivity();
        window.general.addClassName(form, 'hidden');
      }
    };

    var show = function () {
      if (form) {
        setFormInteractivity();
        renderForm(dataElement);
        window.general.removeClassName(form, 'hidden');
      }
    };

    var onCancelButtonClick = function (evt) {
      window.events.isEvent(evt, hide);
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hide);
    };

    var setFormInteractivity = function () {
      document.addEventListener('keydown', onDocumentKeyDown);
      if (formCancel) {
        formCancel.addEventListener('click', onCancelButtonClick);
      }
    };

    var removeFormInteractivity = function () {
      document.removeEventListener('keydown', onDocumentKeyDown);
      if (formCancel) {
        formCancel.removeEventListener('click', onCancelButtonClick);
      }
    };

    var renderComments = function (parent, comments) {
      var createComment = function (template, comment) {
        var element = template.cloneNode(true);
        window.dom.setAttributeBySelector(element, '.social__picture', 'src', window.data.getRandomAvatar());
        window.dom.setAttributeBySelector(element, '.social__text', 'textContent', comment);
        return element;
      };

      var insertionPoint = parent.querySelector('.social__comments');
      if (insertionPoint && pseudoTemplate) {
        var template = pseudoTemplate.cloneNode(true);
        var fragment = document.createDocumentFragment();
        window.dom.removeChildren(insertionPoint);
        if (comments.length > 0) {
          for (var i = 0; i < Math.min(comments.length, COMMENTS_AMOUNT_IN_MARKUP); i++) {
            fragment.appendChild(createComment(template, comments[i], comments.length));
          }
        }
        insertionPoint.appendChild(fragment);
      }
    };

    var renderForm = function () {
      if (form) {
        window.dom.setAttributeBySelector(form, '.big-picture__img > img', 'src', dataElement.url);
        window.dom.setAttributeBySelector(form, '.likes-count', 'textContent', dataElement.likes);
        window.dom.setAttributeBySelector(form, '.comments-count', 'textContent', dataElement.comments.length);
        window.dom.setAttributeBySelector(form, '.social__caption', 'textContent', dataElement.description);
        renderComments(form, dataElement.comments);

        if (totalComments) {
          var markup = totalComments.innerHTML;
          markup = markup.replace(/\d*\sиз\s/, Math.min(dataElement.comments.length, COMMENTS_AMOUNT_IN_MARKUP) + ' из ');
          totalComments.innerHTML = markup;
        }

        window.dom.addClassNameBySelector(form, '.social__comment-count', 'visually-hidden');
        window.dom.addClassNameBySelector(form, '.comments-loader', 'visually-hidden');
      }
    };

    var form = links.bigPhoto;
    var formCancel = links.bigPhotoCancel;
    var pseudoTemplate = links.pseudoTemplate;
    var totalComments = links.totalComments;
    show(dataElement);
  };

  window.preview = {
    showBigPhoto: init
  };

})();
