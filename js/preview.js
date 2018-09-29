'use strict';

(function () {
  var COMMENTS_PORTION_IN_MARKUP = 5;

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

    var loadMore = function () {
      var nextStage = shownCommentsAmount + Math.min(dataElement.comments.length - shownCommentsAmount, COMMENTS_PORTION_IN_MARKUP);
      for (var i = shownCommentsAmount; i < nextStage; i++) {
        window.general.removeClassName(formComments.childNodes[i], 'visually-hidden');
      }
      shownCommentsAmount = nextStage;
      setLoaderState();
    };

    var onLoaderClick = function (evt) {
      window.events.isEvent(evt, loadMore);
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
      if (formCommentsLoader) {
        formCommentsLoader.addEventListener('click', onLoaderClick);
      }
    };

    var removeFormInteractivity = function () {
      document.removeEventListener('keydown', onDocumentKeyDown);
      if (formCancel) {
        formCancel.removeEventListener('click', onCancelButtonClick);
      }
      if (formCommentsLoader) {
        formCommentsLoader.removeEventListener('click', onLoaderClick);
      }
    };

    var renderComments = function (parent, comments) {
      var createComment = function (template, comment, index) {
        var element = template.cloneNode(true);
        window.dom.setAttributeBySelector(element, '.social__picture', 'src', window.common.getRandomAvatar());
        window.dom.setAttributeBySelector(element, '.social__text', 'textContent', comment);
        if (index >= shownCommentsAmount) {
          window.general.addClassName(element, 'visually-hidden');
        }
        return element;
      };

      var insertionPoint = formComments;
      if (insertionPoint && pseudoTemplate) {
        var template = pseudoTemplate.cloneNode(true);
        var fragment = document.createDocumentFragment();
        window.dom.removeChildren(insertionPoint);
        if (comments.length > 0) {
          comments.forEach(function (item, i) {
            fragment.appendChild(createComment(template, comments[i], i));
          });
          insertionPoint.appendChild(fragment);
        }
      }
    };

    var setLoaderState = function () {
      if (totalComments) {
        var markup = totalComments.innerHTML;
        markup = markup.replace(/\d*\sиз\s/, shownCommentsAmount + ' из ');
        totalComments.innerHTML = markup;
      }
      if (formCommentsLoader) {
        var needToHide = ((shownCommentsAmount < COMMENTS_PORTION_IN_MARKUP) || ((shownCommentsAmount) >= dataElement.comments.length));
        formCommentsLoader.disabled = needToHide;
        if (needToHide) {
          window.general.addClassName(formCommentsLoader, 'hidden');
        } else {
          window.general.removeClassName(formCommentsLoader, 'hidden');
        }
      }
    };

    var renderForm = function () {
      if (form) {
        window.dom.setAttributeBySelector(form, '.big-picture__img > img', 'src', dataElement.url);
        window.dom.setAttributeBySelector(form, '.likes-count', 'textContent', dataElement.likes);
        window.dom.setAttributeBySelector(form, '.comments-count', 'textContent', dataElement.comments.length);
        window.dom.setAttributeBySelector(form, '.social__caption', 'textContent', dataElement.description);
        renderComments(form, dataElement.comments);
        setLoaderState();
      }
    };

    var pseudoTemplate = links.pseudoTemplate;
    var totalComments = links.totalComments;
    var form = links.bigPhoto;
    var formCancel = links.bigPhotoCancel;
    var formComments = links.bigPhotoComments;
    var formCommentsLoader = links.bigPhotoCommentsLoader;
    var shownCommentsAmount = Math.min(dataElement.comments.length, COMMENTS_PORTION_IN_MARKUP);
    show(dataElement);
  };

  window.preview = {
    showBigPhoto: init
  };

})();
