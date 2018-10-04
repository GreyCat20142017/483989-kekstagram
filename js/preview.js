'use strict';

(function () {
  var COMMENTS_PORTION_IN_MARKUP = 5;

  var initBigPhoto = function (dataRecord, links) {

    var hideBigPhoto = function () {
      if (form) {
        removeFormInteractivity();
        window.general.addClassName(form, 'hidden');
      }
    };

    var showBigPhoto = function () {
      if (form) {
        setFormInteractivity();
        renderForm(dataRecord);
        window.general.removeClassName(form, 'hidden');
      }
    };

    var loadMore = function () {
      var nextStage = shownCommentsAmount + Math.min(dataRecord.comments.length - shownCommentsAmount, COMMENTS_PORTION_IN_MARKUP);
      for (var i = shownCommentsAmount; i < nextStage; i++) {
        window.general.removeClassName(formComments.childNodes[i], 'visually-hidden');
      }
      shownCommentsAmount = nextStage;
      setCommentsState();
    };

    var setCommentsState = function () {
      if (totalComments) {
        var markup = totalComments.innerHTML;
        markup = markup.replace(/\d*\sиз\s/, shownCommentsAmount + ' из ');
        totalComments.innerHTML = markup;
      }
      if (formCommentsLoader) {
        var needToHide = ((shownCommentsAmount < COMMENTS_PORTION_IN_MARKUP) || ((shownCommentsAmount) >= dataRecord.comments.length));
        formCommentsLoader.disabled = needToHide;
        if (needToHide) {
          window.general.addClassName(formCommentsLoader, 'hidden');
        } else {
          window.general.removeClassName(formCommentsLoader, 'hidden');
        }
      }
    };

    var onLoaderClick = function (evt) {
      window.events.isEvent(evt, loadMore);
    };

    var onCancelButtonClick = function (evt) {
      window.events.isEvent(evt, hideBigPhoto);
    };

    var onDocumentKeyDown = function (evt) {
      window.events.isEscEvent(evt, hideBigPhoto);
    };

    var switchFormInteractivity = function (action) {
      document[action]('keydown', onDocumentKeyDown);
      if (formCancel) {
        formCancel[action]('click', onCancelButtonClick);
      }
      if (formCommentsLoader) {
        formCommentsLoader[action]('click', onLoaderClick);
      }
    };

    var setFormInteractivity = function () {
      switchFormInteractivity('addEventListener');
    };

    var removeFormInteractivity = function () {
      switchFormInteractivity('removeEventListener');
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

    var renderForm = function () {
      if (form) {
        window.dom.setAttributeBySelector(form, '.big-picture__img > img', 'src', dataRecord.url);
        window.dom.setAttributeBySelector(form, '.likes-count', 'textContent', dataRecord.likes);
        window.dom.setAttributeBySelector(form, '.comments-count', 'textContent', dataRecord.comments.length);
        window.dom.setAttributeBySelector(form, '.social__caption', 'textContent', dataRecord.description);
        renderComments(form, dataRecord.comments);
        setCommentsState();
      }
    };

    var pseudoTemplate = links.pseudoTemplate;
    var totalComments = links.totalComments;
    var form = links.bigPhoto;
    var formCancel = links.bigPhotoCancel;
    var formComments = links.bigPhotoComments;
    var formCommentsLoader = links.bigPhotoCommentsLoader;
    var shownCommentsAmount = Math.min(dataRecord.comments.length, COMMENTS_PORTION_IN_MARKUP);
    showBigPhoto(dataRecord);
  };

  window.preview = {
    initBigPhoto: initBigPhoto
  };

})();
