'use strict';

(function () {
  var PHOTO_KEY = 'data-id';

  var renderPhotos = function (dataArray) {
    var createPhoto = function (template, dataElement) {
      var element = template.cloneNode(true);
      window.dom.setAttributeBySelector(element, '.picture__img', 'src', dataElement.url);
      window.dom.setAttributeBySelector(element, '.picture__likes', 'textContent', dataElement.likes);
      window.dom.setAttributeBySelector(element, '.picture__comments', 'textContent', dataElement.comments.length);
      element.setAttribute(PHOTO_KEY, dataElement.url);
      return element;
    };

    var template = userPhotoTemplate;
    var insertionPoint = pictures;
    if (template && insertionPoint) {
      var fragment = document.createDocumentFragment();
      dataArray.forEach(function (item) {
        fragment.appendChild(createPhoto(template, item));
      });
      insertionPoint.appendChild(fragment);
    }
  };

  var onPicturesClick = function (evt) {
    var el = evt.target;
    if (el.tagName !== 'IMG') {
      return false;
    }
    evt.preventDefault();
    while (el !== pictures) {
      if (el.hasAttribute(PHOTO_KEY)) {
        var index = photos.indexOf(photos.filter(function (item) {
          return item.url === el.getAttribute(PHOTO_KEY);
        })[0]);
        if ((index >= 0) && (index < photos.length) && window.preview) {
          window.preview.showBigPhoto(photos[index], links);
        }
        return false;
      }
      el = el.parentNode;
    }
    return false;
  };

  var onUploadFileChange = function (evt) {
    evt.preventDefault();
    if (window.form) {
      window.form.showEditingForm(links, messages);
    }
  };

  var checkModuleAddition = function () {
    var modules = ['common', 'general', 'dom', 'events', 'links'];
    for (var i = 0; i < modules.length; i++) {
      if (!window[modules[i]]) {
        return false;
      }
    }
    return true;
  };

  var initMessages = function (templates, insertionPoint) {
    var fragment = document.createDocumentFragment();
    templates.forEach(function (template) {
      if (template && insertionPoint) {
        var message = fragment.appendChild(template.cloneNode(true));
        window.general.addClassName(message, 'visually-hidden');
      }
    });
    insertionPoint.appendChild(fragment);
    return {errorMessage: window.dom.getElementBySelector(insertionPoint, '.error'),
      successMessage: window.dom.getElementBySelector(insertionPoint, '.success')};
  };

  var initGallery = function () {
    if (window.backend) {
      window.backend.getData(onGet, onGetError);
    }
    if (uploadFile && links.formOverlay && links.formCancel) {
      uploadFile.addEventListener('change', onUploadFileChange);
    }
    if (pictures && links.bigPhoto && links.bigPhotoCancel) {
      pictures.addEventListener('click', onPicturesClick);
    }
  };

  var onGet = function (response) {
    photos = [];
    response.forEach(function (item) {
      photos.push(item);
    });
    renderPhotos(photos);
  };

  var onGetError = function (errorMessage) {
    window.message.init(messages.errorMessage, errorMessage, true);
  };

  if (checkModuleAddition()) {
    var links = window.links;
    var pictures = links.pictures;
    var uploadFile = links.uploadFile;
    var userPhotoTemplate = links.userPhotoTemplate;
    var messages = initMessages([links.errorMessageTemplate, links.successMessageTemplate], links.main);
    var photos = [];
    initGallery();
  }

})();
