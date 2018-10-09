'use strict';

(function () {

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

  var main = document.querySelector('main');
  var editingForm = window.dom.getElementBySelector(main, '.img-upload__form');
  var editingFormOverlay = window.dom.getElementBySelector(editingForm, '.img-upload__overlay');
  var bigPhoto = window.dom.getElementBySelector(main, '.big-picture');

  var links = {
    main: main,
    form: editingForm,
    formOverlay: editingFormOverlay,
    formCancel: window.dom.getElementBySelector(editingFormOverlay, '#upload-cancel'),
    formPin: window.dom.getElementBySelector(editingFormOverlay, '.effect-level__pin'),
    formEffectContainer: window.dom.getElementBySelector(editingFormOverlay, '.img-upload__effect-level'),
    formEffectLevel: window.dom.getElementBySelector(editingFormOverlay, '.effect-level__value'),
    formEffectDepth: window.dom.getElementBySelector(editingFormOverlay, '.effect-level__depth'),
    formEffectDefault: window.dom.getElementBySelector(editingFormOverlay, '#effect-none'),
    formImgPreview: window.dom.getElementBySelector(editingFormOverlay, '.img-upload__preview > img'),
    formInputs: editingFormOverlay.querySelectorAll('input:enabled:not(.visually-hidden), textarea:enabled:not(.visually-hidden)'),
    formOverlayInteractiveItems: editingFormOverlay.querySelectorAll('input:enabled:not(:read-only), textarea:enabled:not(.visually-hidden), button'),
    formScaleDecrease: window.dom.getElementBySelector(editingFormOverlay, '.scale__control--smaller'),
    formScaleIncrease: window.dom.getElementBySelector(editingFormOverlay, '.scale__control--bigger'),
    formScaleValue: window.dom.getElementBySelector(editingFormOverlay, '.scale__control--value'),
    formSubmit: window.dom.getElementBySelector(editingFormOverlay, '#upload-submit'),
    uploadFile: window.dom.getElementBySelector(main, '#upload-file'),
    pictures: window.dom.getElementBySelector(main, '.pictures'),
    bigPhoto: bigPhoto,
    bigPhotoCancel: window.dom.getElementBySelector(bigPhoto, '#picture-cancel'),
    bigPhotoComments: window.dom.getElementBySelector(bigPhoto, '.social__comments'),
    bigPhotoCommentsLoader: window.dom.getElementBySelector(bigPhoto, '.comments-loader'),
    bigPhotoInteractiveItems: bigPhoto.querySelectorAll('input:enabled:not(.visually-hidden), button'),
    bigPhotoLastButton: window.dom.getElementBySelector(bigPhoto, '.social__footer-btn'),
    pseudoTemplate: document.querySelector('.social__comment').cloneNode(true),
    totalComments: window.dom.getElementBySelector(bigPhoto, '.social__comment-count'),
    userPhotoTemplate: window.dom.getTemplateContent('#picture', '.picture'),
    messages: initMessages([window.dom.getTemplateContent('#error', '.error'), window.dom.getTemplateContent('#success', '.success')], main),
    filters: window.dom.getElementBySelector(main, '.img-filters')
  };

  main = null;
  editingForm = null;
  editingFormOverlay = null;
  bigPhoto = null;

  if (window.gallery) {
    window.gallery.init(links);
  }

})();
