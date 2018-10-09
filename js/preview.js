'use strict';

(function () {
  var COMMENTS_PORTION_IN_MARKUP = 5;

  var initBigPhoto = function (dataRecord, links, currentPhoto) {

    var hideBigPhoto = function () {
      if (links.bigPhoto) {
        removeFormInteractivity();
        window.general.resetTabIndex(window.general.getDisabledTabIndex(), links.bigPhotoInteractiveItems);
        window.general.addClassName(links.bigPhoto, 'hidden');
        window.general.setFocusOnObject(currentPhoto);
      }
    };

    var showBigPhoto = function () {
      if (links.bigPhoto) {
        setFormInteractivity();
        renderForm(dataRecord);
        window.general.removeClassName(links.bigPhoto, 'hidden');
        if (links.bigPhotoCancel) {
          window.general.resetTabIndex(window.general.getMaxTabIndex(), links.bigPhotoInteractiveItems);
          links.bigPhotoCancel.tabIndex = window.general.getIncreasedTabIndex();
          window.general.setFocusOnObject(links.bigPhotoCancel);
        }
      }
    };

    var loadMore = function () {
      var nextStage = shownCommentsAmount + Math.min(dataRecord.comments.length - shownCommentsAmount, COMMENTS_PORTION_IN_MARKUP);
      for (var i = shownCommentsAmount; i < nextStage; i++) {
        window.general.removeClassName(links.bigPhotoComments.childNodes[i], 'visually-hidden');
      }
      shownCommentsAmount = nextStage;
      setCommentsState();
    };

    var setCommentsState = function () {
      if (links.totalComments) {
        var markup = links.totalComments.innerHTML;
        markup = markup.replace(/\d*\sиз\s/, shownCommentsAmount + ' из ');
        links.totalComments.innerHTML = markup;
      }
      if (links.bigPhotoCommentsLoader) {
        var needToHide = ((shownCommentsAmount < COMMENTS_PORTION_IN_MARKUP) || ((shownCommentsAmount) >= dataRecord.comments.length));
        links.bigPhotoCommentsLoader.disabled = needToHide;
        if (needToHide) {
          window.general.addClassName(links.bigPhotoCommentsLoader, 'hidden');
        } else {
          window.general.removeClassName(links.bigPhotoCommentsLoader, 'hidden');
        }
      }
    };

    var onLoaderClick = function (evt) {
      window.general.isEvent(evt, loadMore);
    };

    var onCancelButtonClick = function (evt) {
      window.general.isEvent(evt, hideBigPhoto);
    };

    var onDocumentKeyDown = function (evt) {
      window.general.isEscEvent(evt, hideBigPhoto);
    };

    var onOverlayTabKeyDown = function (evt) {
      window.general.isOverlayTabEvent(evt, links.bigPhotoCancel, links.bigPhotoLastButton);
    };

    var switchFormInteractivity = function (action) {
      document[action]('keydown', onDocumentKeyDown);
      if (links.bigPhotoCancel) {
        links.bigPhotoCancel[action]('click', onCancelButtonClick);
      }
      if (links.bigPhotoCommentsLoader) {
        links.bigPhotoCommentsLoader[action]('click', onLoaderClick);
      }
      if (links.bigPhoto) {
        links.bigPhoto[action]('keydown', onOverlayTabKeyDown);
      }
    };

    var setFormInteractivity = function () {
      switchFormInteractivity('addEventListener');
    };

    var removeFormInteractivity = function () {
      switchFormInteractivity('removeEventListener');
    };

    var renderComments = function (parent, comments, insertionPoint, pseudoTemplate) {
      var createComment = function (template, comment, index) {
        var element = template.cloneNode(true);
        window.dom.setAttributeBySelector(element, '.social__picture', 'src', window.common.getRandomAvatar());
        window.dom.setAttributeBySelector(element, '.social__text', 'textContent', comment);
        if (index >= shownCommentsAmount) {
          window.general.addClassName(element, 'visually-hidden');
        }
        return element;
      };

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
      if (links.bigPhoto) {
        window.dom.setAttributeBySelector(links.bigPhoto, '.big-picture__img > img', 'src', dataRecord.url);
        window.dom.setAttributeBySelector(links.bigPhoto, '.likes-count', 'textContent', dataRecord.likes);
        window.dom.setAttributeBySelector(links.bigPhoto, '.comments-count', 'textContent', dataRecord.comments.length);
        window.dom.setAttributeBySelector(links.bigPhoto, '.social__caption', 'textContent', dataRecord.description);
        renderComments(links.bigPhoto, dataRecord.comments, links.bigPhotoComments, links.pseudoTemplate);
        setCommentsState();
      }
    };

    var shownCommentsAmount = Math.min(dataRecord.comments.length, COMMENTS_PORTION_IN_MARKUP);
    showBigPhoto(dataRecord);
  };

  window.preview = {
    initBigPhoto: initBigPhoto
  };

})();
