/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Jeremy Whitlock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var slash = require('slash');

/**
 * Resolves (possibly relative) location to absolute.
 *
 * @param {string} location - The filesystem location (If relative, location is relative to process.cwd()).
 * @returns {object} Returns the original and resolved document locations
 */
module.exports.resolveLocation = function (location) {
  var requested = location;

  // Strip the scheme portion of the URI
  if (location.indexOf('file://') === 0) {
    // Handle URI
    location = location.substr(7);
  }

  if (path.resolve(location) !== path.normalize(location)) {
    // Handle relative paths
    location = path.resolve(process.cwd(), location);
  }
  var resolvedLocation = slash(location);
  if (/^win/i.test(process.platform)) {
    resolvedLocation = resolvedLocation[0].toLowerCase() + resolvedLocation.substring(1);
  }
  var resolved = resolvedLocation;

  return {
    requested: requested,
    resolved: resolved
  };
};


/**
 * Loads a file from the filesystem.
 *
 * @param {string} location - The filesystem location (Assumes location, if relative, has been resolved using the resolveLocation function above).
 * @param {object} options - The loader options (Unused)
 * @param {string} [options.encoding='utf-8'] - The encoding to use when loading the file
 * @param {function} callback - The error-first callback
 */
module.exports.load = function (location, options, callback) {
  if (typeof options.encoding !== 'undefined' && typeof options.encoding !== 'string') {
    throw new TypeError('options.encoding must be a string');
  }

  fs.readFile(location, {encoding: options.encoding || 'utf-8'}, callback);
};
