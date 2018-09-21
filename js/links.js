'use strict';

(function () {
  var pictures = document.querySelector('.pictures');
  var uploadFile = window.dom.getElementBySelector(pictures, '#upload-file');

  var editingForm = window.dom.getElementBySelector(pictures, '.img-upload__overlay');
  var editingFormCancel = window.dom.getElementBySelector(editingForm, '#upload-cancel');
  var editingFormPin = window.dom.getElementBySelector(editingForm, '.effect-level__pin');
  var editingFormEffectContainer = window.dom.getElementBySelector(editingForm, '.img-upload__effect-level');
  var editingFormEffectLevel = window.dom.getElementBySelector(editingForm, '.effect-level__value');
  var editingFormEffectDepth = window.dom.getElementBySelector(editingForm, '.effect-level__depth');
  var editingFormImgPreview = window.dom.getElementBySelector(editingForm, '.img-upload__preview > img');

  var bigPhoto = document.querySelector('.big-picture');
  var bigPhotoCancel = window.dom.getElementBySelector(bigPhoto, '#picture-cancel');
  var pseudoTemplate = document.querySelector('.social__comment').cloneNode(true);
  var totalComments = document.querySelector('.social__comment-count');

  window.links = {
    editingFormLinks: {
      form: editingForm,
      formCancel: editingFormCancel,
      formPin: editingFormPin,
      formEffectContainer: editingFormEffectContainer,
      formEffectLevel: editingFormEffectLevel,
      formEffectDepth: editingFormEffectDepth,
      formImgPreview: editingFormImgPreview,
      uploadFile: uploadFile
    },
    galleryLinks: {
      uploadFile: uploadFile,
      pictures: pictures
    },
    previewLinks: {
      bigPhoto: bigPhoto,
      bigPhotoCancel: bigPhotoCancel,
      pseudoTemplate: pseudoTemplate,
      totalComments: totalComments
    }
  };
})();
