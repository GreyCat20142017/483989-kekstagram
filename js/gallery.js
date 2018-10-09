'use strict';

(function () {
  var PHOTO_KEY = 'data-id';
  var RANDOM_PHOTO_AMOUNT = 10;
  var FILTERS = {popular: 'filter-popular', random: 'filter-new', discussed: 'filter-discussed'};
  var ACTIVE_FILTER_CLASS = 'img-filters__button--active';
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];
  var MODULES = ['common', 'general', 'dom'];

  var init = function (links) {

    var renderPhotos = function (dataRecords, template, insertionPoint) {
      var removePrevious = function () {
        var oldPhotos = insertionPoint.querySelectorAll('.picture');
        Array.prototype.slice.call(oldPhotos).forEach(function (element) {
          insertionPoint.removeChild(element);
        });
      };

      var createPhoto = function (dataRecord) {
        var element = template.cloneNode(true);
        window.dom.setAttributeBySelector(element, '.picture__img', 'src', dataRecord.url);
        window.dom.setAttributeBySelector(element, '.picture__likes', 'textContent', dataRecord.likes);
        window.dom.setAttributeBySelector(element, '.picture__comments', 'textContent', dataRecord.comments.length);
        element.setAttribute(PHOTO_KEY, dataRecord.url);
        return element;
      };

      if (template && insertionPoint) {
        var fragment = document.createDocumentFragment();
        dataRecords.forEach(function (item) {
          fragment.appendChild(createPhoto(item));
        });
        removePrevious();
        insertionPoint.appendChild(fragment);
      }
    };

    var onPicturesClick = function (evt) {
      var element = evt.target;
      if ((element.tagName !== 'IMG') && (element.tagName !== 'A')) {
        return false;
      }
      evt.preventDefault();
      while (element !== links.pictures) {
        if (element.hasAttribute(PHOTO_KEY)) {
          var index = photos.indexOf(photos.filter(function (item) {
            return item.url === element.getAttribute(PHOTO_KEY);
          })[0]);
          if ((index >= 0) && (index < photos.length) && window.preview) {
            window.preview.initBigPhoto(photos[index], links, (element.tagName === 'IMG') ? element.parentElement : element);
          }
          return false;
        }
        element = element.parentNode;
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
      return !MODULES.some(function (item) {
        return !window.hasOwnProperty(item);
      });
    };

    var initGalleryComponents = function () {
      if (window.backend) {
        window.backend.getData(onGetData, onGetDataError);
      }
      if (links.uploadFile && links.formOverlay && links.formCancel) {
        links.uploadFile.addEventListener('change', onUploadFileChange);
      }
      if (links.pictures && links.bigPhoto && links.bigPhotoCancel) {
        links.pictures.addEventListener('click', onPicturesClick);
      }
    };

    var switchActiveButton = function (button) {
      if (links.filters && button) {
        window.dom.removeClassNameBySelector(links.filters, '.' + ACTIVE_FILTER_CLASS, ACTIVE_FILTER_CLASS);
        window.general.addClassName(button, ACTIVE_FILTER_CLASS);
      }
    };

    var renderPhotosByFilter = function (filter, button) {
      if (currentFilter !== filter) {
        currentFilter = filter;
        switchActiveButton(button);
        switch (currentFilter) {
          case FILTERS.popular:
            renderPhotos(photos, links.userPhotoTemplate, links.pictures);
            break;
          case FILTERS.random:
            renderPhotos(window.common.getRandomLimitedSetFromArray(photos, RANDOM_PHOTO_AMOUNT), links.userPhotoTemplate, links.pictures);
            break;
          case FILTERS.discussed:
            renderPhotos(window.common.getPhotosByRank(photos), links.userPhotoTemplate, links.pictures);
            break;
          default:
            break;
        }
      }
    };

    var initFilter = function () {
      var showFilter = function () {
        setFilterInteractivity();
        window.general.removeClassName(links.filters, 'img-filters--inactive');
      };

      var setFilterInteractivity = function () {
        if (links.filters) {
          links.filters.addEventListener('click', onFilterClick);
        }
      };

      var onFilterChange = window.common.debounce(function (button) {
        renderPhotosByFilter(button.id, button);
      });

      var onFilterClick = function (evt) {
        var element = evt.target;
        if (element.tagName === 'BUTTON' && element.classList.contains('img-filters__button')) {
          onFilterChange(element);
        }
      };
      showFilter();
    };

    var loadPicture = function () {
      if (links.uploadFile && links.formImgPreview) {
        var file = links.uploadFile.files[0];
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (item) {
          return fileName.endsWith(item);
        });
        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            links.formImgPreview.src = reader.result;
          });
          reader.readAsDataURL(file);
          window.form.init(links, links.messages);
        }
      }
    };

    var onGetData = function (response) {
      photos = [];
      response.forEach(function (item) {
        photos.push(item);
      });
      initFilter();
      renderPhotosByFilter(FILTERS.popular);
    };

    var onGetDataError = function (errorMessage) {
      window.message.init(links.messages.errorMessage, errorMessage, true);
    };

    if (checkModuleAddition()) {
      var photos = [];
      var currentFilter = '';
      initGalleryComponents();
    }
  };

  window.gallery = {
    init: init
  };

})();
