'use strict';

(function () {

  var PHOTO_KEY = 'data-id';


  var renderPhotos = function (dataArray) {

    var createPhoto = function (template, dataElement) {
      var element = template.cloneNode(true);
      window.dom.setAttributeBySelector(element, '.picture__img', 'src', dataElement.url);
      window.dom.setAttributeBySelector(element, '.picture__likes', 'textContent', dataElement.likes);
      window.dom.setAttributeBySelector(element, '.picture__comments', 'textContent', dataElement.comments.length);
      element.setAttribute(PHOTO_KEY, dataElement.id);
      return element;
    };

    var template = window.dom.getTemplateContent('#picture', '.picture');
    var insertionPoint = document.querySelector('.pictures');

    if (template && insertionPoint) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < dataArray.length; i++) {
        fragment.appendChild(createPhoto(template, dataArray[i]));
      }
      insertionPoint.appendChild(fragment);
    }
  };


  var onPicturesClick = function (evt) {
    var el = evt.target;
    if (el.tagName.toUpperCase() !== 'IMG') {
      return false;
    }
    evt.preventDefault();
    while (el !== pictures) {
      if (el.hasAttribute(PHOTO_KEY)) {
        var index = photos.indexOf(photos.filter(function (item) {
          return item.id === el.getAttribute(PHOTO_KEY);
        })[0]);
        if ((index >= 0) && (index < photos.length)) {
          window.preview.showBigPhoto(photos[index]);
        }
        return false;
      }
      el = el.parentNode;
    }
    return false;
  };

  var onUploadFileChange = function (evt) {
    evt.preventDefault();
    window.form.showEditingForm();
  };

  var initGallery = function () {
    renderPhotos(photos);
    if (uploadFile && editingFormLinks.form && editingFormLinks.formCancel) {
      uploadFile.addEventListener('change', onUploadFileChange);
    }
    if (pictures && previewLinks.bigPhoto && previewLinks.bigPhotoCancel) {
      pictures.addEventListener('click', onPicturesClick);
    }
  };

  var pictures = window.links.galleryLinks.pictures;
  var uploadFile = window.links.galleryLinks.uploadFile;
  var editingFormLinks = window.links.editingFormLinks;
  var previewLinks = window.links.previewLinks;


  var photos = window.common.shuffleArray(window.data.generateObjectArray());

  initGallery();

})();
