'use strict';

(function () {
  window.general = {
    removeClassName: function (obj, className) {
      if (obj && obj.classList.contains(className)) {
        obj.classList.remove(className);
      }
    },

    addClassName: function (obj, className) {
      if (obj && !obj.classList.contains(className)) {
        obj.classList.add(className);
      }
    }
  };
})();
