(function() {
  var GrayscaleFavicon = {};
  var currentFavicon = null;
  var originalFavicon = null;
  var faviconImage = null;
  var canvas = null;
  var size = 32;

  var getElements = function(tagName) {
    return document.getElementsByTagName(tagName);
  };

  var getHead = function() {
    return getElements('head')[0];
  };

  var getLinks = function() {
    return getElements('link');
  };

  var getLink = function(index) {
    return getLinks()[index];
  };

  var isExist = function(element) {
    return (typeof element !== 'undefined');
  };

  var createElement = function(tagName) {
    return document.createElement(tagName);
  };

  var isFaviconTag = function(tag) {
    return (tag.getAttribute('rel') || '').match(/\bicon\b/);
  };

  var getFaviconTag = function() {
    for (var i = 0, len = getLinks().length; i < len; i = i + 1) {
      var link = getLink(i);

      if (isFaviconTag(link)) return link;
    }

    return false;
  };

  var removeFaviconTag = function() {
    for (var i = 0, len = getLinks().length; i < len; i = i + 1) {
      var link = getLink(i);

      if (isExist(link) && isFaviconTag(link)) getHead().removeChild(link);
    }
  };

  var getFavicon = function(defaultFaviconUrl) {
    var faviconUrl = defaultFaviconUrl || './favicon.ico';
    var tag = getFaviconTag();

    if (!originalFavicon || !currentFavicon) {
      originalFavicon = currentFavicon = tag ? tag.getAttribute('href') : faviconUrl;
    }

    return currentFavicon;
  };

  var getCanvas = function() {
    if (!canvas) {
      canvas = createElement('canvas');
      canvas.width = size;
      canvas.height = size;
    }

    return canvas;
  };

  var setFaviconTag = function(url) {
    removeFaviconTag();

    var link = createElement('link');

    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = url;

    getHead().appendChild(link);
  };

  var drawFavicon = function(defautlFaviconUrl, defaultColour) {
    var context = getCanvas().getContext('2d');
    var colour = defaultColour || '#000000';
    var src = getFavicon(defautlFaviconUrl);

    var clearContext = function(context, delta, size) {
      context.clearRect(delta, delta, size, size);
    };

    var drawFaviconInContext = function(faviconImage, context, delta, size) {
      context.drawImage(faviconImage, delta, delta, faviconImage.width, faviconImage.height, delta, delta, size, size);
    };

    var getImageData = function(faviconImage, context, delta) {
      return context.getImageData(delta, delta, faviconImage.width, faviconImage.height);
    };

    var updateImageData = function(imageData, delta) {
      context.putImageData(imageData, delta, delta, delta, delta, imageData.width, imageData.height);
    };

    faviconImage = createElement('img');
    faviconImage.onload = function() {
      clearContext(context, 0, size);
      drawFaviconInContext(faviconImage, context, 0, size);

      var imgPixels = getImageData(faviconImage, context, 0, size);

      for (var y = 0; y < imgPixels.height; y = y + 1) {
        for (var x = 0; x < imgPixels.width; x = x + 1) {
          var i = (y * 4) * imgPixels.width + x * 4;
          var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;

          imgPixels.data[i] = avg;
          imgPixels.data[i + 1] = avg;
          imgPixels.data[i + 2] = avg;
        }
      }

      updateImageData(imgPixels, 0);
      refreshFavicon();
    };

    if (!src.match(/^data/)) faviconImage.crossOrigin = 'localhost';

    faviconImage.src = src;
  };

  var isCanvasSupported = function() {
    return getCanvas().getContext;
  };

  var refreshFavicon = function() {
    if (isCanvasSupported()) return setFaviconTag(getCanvas().toDataURL());
  };

  GrayscaleFavicon.grayscale = function(faviconUrl) {
    drawFavicon(faviconUrl);
  };

  GrayscaleFavicon.reset = function() {
    setFaviconTag(originalFavicon);
  };

  window.GrayscaleFavicon = GrayscaleFavicon;

  if (typeof define === 'function' && define.amd) define(GrayscaleFavicon);
})();

