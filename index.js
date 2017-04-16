'use strict';

var GrayscaleFavicon = {};
var currentFavicon = null;
var originalFavicon = null;
var faviconImage = null;
var canvas = null;
var size = 32;

function getElements(tagName) {
  return document.getElementsByTagName(tagName);
};

function getHead() {
  return getElements('head')[0];
};

function getLinks() {
  return getElements('link');
};

function getLink(index) {
  return getLinks()[index];
};

function isExist(element) {
  return (typeof element !== 'undefined');
};

function createElement(tagName) {
  return document.createElement(tagName);
};

function isFaviconTag(tag) {
  return (tag.getAttribute('rel') || '').match(/\bicon\b/);
};

function getFaviconTag() {
  for (var i = 0, len = getLinks().length; i < len; i = i + 1) {
    var link = getLink(i);

    if (isFaviconTag(link)) return link;
  }

  return false;
};

function removeFaviconTag() {
  for (var i = 0, len = getLinks().length; i < len; i = i + 1) {
    var link = getLink(i);

    if (isExist(link) && isFaviconTag(link)) getHead().removeChild(link);
  }
};

function getFavicon(defaultFaviconUrl) {
  var faviconUrl = defaultFaviconUrl || './favicon.ico';
  var tag = getFaviconTag();

  if (!originalFavicon || !currentFavicon) {
    originalFavicon = currentFavicon = tag ? tag.getAttribute('href') : faviconUrl;
  }

  return currentFavicon;
};

function getCanvas() {
  if (!canvas) {
    canvas = createElement('canvas');
    canvas.width = size;
    canvas.height = size;
  }

  return canvas;
};

function setFaviconTag(url) {
  removeFaviconTag();

  var link = createElement('link');

  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = url;

  getHead().appendChild(link);
};

function drawFavicon(defautlFaviconUrl, defaultColour) {
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

function isCanvasSupported() {
  return getCanvas().getContext;
};

function refreshFavicon() {
  if (isCanvasSupported()) return setFaviconTag(getCanvas().toDataURL());
};

module.exports = function(faviconUrl) {
  drawFavicon(faviconUrl);
};

module.exports.reset = function() {
  setFaviconTag(originalFavicon);
};

