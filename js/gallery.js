'use strict';

(function () {
  var PHOTO_KEY = 'data-id';
  var RANDOM_PHOTO_AMOUNT = 10;
  var FILTERS = {popular: 'filter-popular', random: 'filter-new', discussed: 'filter-discussed'};
  var ACTIVE_FILTER_CLASS = 'img-filters__button--active';
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];

  var renderPhotos = function (dataArray) {
    var removePrevious = function (insertionPoint) {
      var oldPhotos = insertionPoint.querySelectorAll('.picture');
      Array.prototype.slice.call(oldPhotos).forEach(function (el) {
        insertionPoint.removeChild(el);
      });
    };

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
      removePrevious(insertionPoint);
      insertionPoint.appendChild(fragment);
    }
  };

  var onPicturesClick = function (evt) {
    var el = evt.target;
    if ((el.tagName !== 'IMG') && (el.tagName !== 'A')) {
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
      loadPicture();
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

  var switchActiveButton = function (button) {
    if (filters && button) {
      window.dom.removeClassNameBySelector(filters, '.' + ACTIVE_FILTER_CLASS, ACTIVE_FILTER_CLASS);
      window.general.addClassName(button, ACTIVE_FILTER_CLASS);
    }
  };

  var renderPhotosByFilter = function (filter, button) {
    if (currentFilter !== filter) {
      currentFilter = filter;
      switchActiveButton(button);
      switch (currentFilter) {
        case FILTERS.popular:
          renderPhotos(photos);
          break;
        case FILTERS.random:
          renderPhotos(window.common.getRandomLimitedSetFromArray(photos, RANDOM_PHOTO_AMOUNT));
          break;
        case FILTERS.discussed:
          renderPhotos(window.common.getPhotosByRank(photos));
          break;
        default:
          break;
      }
    }
  };

  var initFilter = function () {
    var showFilter = function () {
      setFilterInteractivity();
      window.general.removeClassName(filters, 'img-filters--inactive');
    };

    var setFilterInteractivity = function () {
      if (filters) {
        filters.addEventListener('click', onFilterClick);
      }
    };

    var onFilterChange = window.common.debounce(function (button) {
      renderPhotosByFilter(button.id, button);
    });

    var onFilterClick = function (evt) {
      var el = evt.target;
      if (el.tagName === 'BUTTON' && el.classList.contains('img-filters__button')) {
        onFilterChange(el);
      }
    };
    showFilter();
  };

  var loadPicture = function () {
    if (uploadFile && formImgPreview) {
      var file = uploadFile.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          formImgPreview.src = reader.result;
        });
        reader.readAsDataURL(file);
        window.form.showEditingForm(links, messages);
      }
    }
  };

  var onGet = function (response) {
    photos = [];
    response.forEach(function (item) {
      photos.push(item);
    });
    initFilter();
    renderPhotosByFilter(FILTERS.popular);
  };

  var onGetError = function (errorMessage) {
    window.message.init(messages.errorMessage, errorMessage, true);
  };

  if (checkModuleAddition()) {
    var links = window.links;
    var pictures = links.pictures;
    var uploadFile = links.uploadFile;
    var formImgPreview = links.formImgPreview;
    var userPhotoTemplate = links.userPhotoTemplate;
    var filters = links.filters;
    var messages = initMessages([links.errorMessageTemplate, links.successMessageTemplate], links.main);
    var photos = [];
    var currentFilter = '';
    initGallery();
  }

})();
