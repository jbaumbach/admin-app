'use strict';

angular.module('adminApp').
  factory('utils', function() {
    return {
      //
      // Preload image(s) so they don't "flicker" when you load them
      //
      preloadImages: (imageUrls) => {
        imageUrls = _.isArray(imageUrls) ? imageUrls : [imageUrls];
        imageUrls.forEach((imageUrl) => {
          var temp = new Image();
          temp.src = imageUrl;
        });
      }
    }
  });
