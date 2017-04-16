# Grayscale favicon [![Build Status](https://travis-ci.org/khusnetdinov/grayscale-favicon.svg?branch=master)](https://travis-ci.org/khusnetdinov/grayscale-favicon) [![npm](https://img.shields.io/npm/v/npm.svg)]()
Grayscale favicon is tool that convert colorfull favicon to grayscale.

Code was taken from [Ruby Environment Favicon](https://github.com/accessd/rails-env-favicon) and adopted for npm, yarn, bower.

Example of usage, normal and grayscaled library:

![img](http://res.cloudinary.com/dtoqqxqjv/image/upload/v1492368573/github/normal.icon.png)
![img](http://res.cloudinary.com/dtoqqxqjv/image/upload/v1492368573/github/grayscale.icon.png)

## Installation
Several installation options are available:
  - install with npm: `npm install grayscale-favicon@1.0.0`
  - install with yarn: `yarn add grayscale-favicon@1.0.0`
  - install with bower: `bower install grayscale-favicon@1.0.0`

## Usage
If you use node.js builder:
```javascript
import GrayscaleFavicon from 'grayscale-favicon';
// var GrayscaleFavicon = require('grayscale-favicon');

GrayscaleFavicon();
```

If you use bower or just want to load file from source in html:
```html
<script src="/path/to/grayscale-favicon.js" type="text/javascript"></script>
<script>
  window.GrayscaleFavicon.icon();
</script>
```
 
## License

The gem is available as open source under the terms of the [MIT
License](http://opensource.org/licenses/MIT).
