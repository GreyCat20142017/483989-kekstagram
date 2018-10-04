'use strict';

(function () {
  var main = document.querySelector('main');
  var pictures = window.dom.getElementBySelector(main, '.pictures');
  var uploadFile = window.dom.getElementBySelector(pictures, '#upload-file');
  var editingForm = window.dom.getElementBySelector(pictures, '.img-upload__form');
  var editingFormOverlay = window.dom.getElementBySelector(editingForm, '.img-upload__overlay');
  var editingFormCancel = window.dom.getElementBySelector(editingFormOverlay, '#upload-cancel');
  var editingFormPin = window.dom.getElementBySelector(editingFormOverlay, '.effect-level__pin');
  var editingFormEffectContainer = window.dom.getElementBySelector(editingFormOverlay, '.img-upload__effect-level');
  var editingFormEffectDefault = window.dom.getElementBySelector(editingFormOverlay, '#effect-none');
  var editingFormEffectLevel = window.dom.getElementBySelector(editingFormOverlay, '.effect-level__value');
  var editingFormEffectDepth = window.dom.getElementBySelector(editingFormOverlay, '.effect-level__depth');
  var editingFormImgPreview = window.dom.getElementBySelector(editingFormOverlay, '.img-upload__preview > img');
  var editingFormInputs = editingFormOverlay.querySelectorAll('input:enabled:not(.visually-hidden), textarea:enabled:not(.visually-hidden)');
  var editingFormScaleDecrease = window.dom.getElementBySelector(editingFormOverlay, '.scale__control--smaller');
  var editingFormScaleIncrease = window.dom.getElementBySelector(editingFormOverlay, '.scale__control--bigger');
  var editingFormScaleValue = window.dom.getElementBySelector(editingFormOverlay, '.scale__control--value');
  var bigPhoto = document.querySelector('.big-picture');
  var bigPhotoCancel = window.dom.getElementBySelector(bigPhoto, '#picture-cancel');
  var bigPhotoComments = window.dom.getElementBySelector(bigPhoto, '.social__comments');
  var bigPhotoCommentsLoader = window.dom.getElementBySelector(bigPhoto, '.comments-loader');
  var pseudoTemplate = document.querySelector('.social__comment').cloneNode(true);
  var totalComments = document.querySelector('.social__comment-count');
  var userPhotoTemplate = window.dom.getTemplateContent('#picture', '.picture');
  var errorMessageTemplate = window.dom.getTemplateContent('#error', '.error');
  var successMessageTemplate = window.dom.getTemplateContent('#success', '.success');
  var filters = window.dom.getElementBySelector(main, '.img-filters');

  window.links = {
    form: editingForm,
    formOverlay: editingFormOverlay,
    formCancel: editingFormCancel,
    formPin: editingFormPin,
    formEffectContainer: editingFormEffectContainer,
    formEffectLevel: editingFormEffectLevel,
    formEffectDepth: editingFormEffectDepth,
    formEffectDefault: editingFormEffectDefault,
    formImgPreview: editingFormImgPreview,
    formInputs: editingFormInputs,
    formScaleDecrease: editingFormScaleDecrease,
    formScaleIncrease: editingFormScaleIncrease,
    formScaleValue: editingFormScaleValue,
    uploadFile: uploadFile,
    pictures: pictures,
    bigPhoto: bigPhoto,
    bigPhotoCancel: bigPhotoCancel,
    bigPhotoComments: bigPhotoComments,
    bigPhotoCommentsLoader: bigPhotoCommentsLoader,
    pseudoTemplate: pseudoTemplate,
    totalComments: totalComments,
    userPhotoTemplate: userPhotoTemplate,
    main: main,
    errorMessageTemplate: errorMessageTemplate,
    successMessageTemplate: successMessageTemplate,
    filters: filters
  };
})();
