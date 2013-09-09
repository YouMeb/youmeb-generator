'use strict';

var path = require('path');
var Generator = require('../lib/generator');

var generator = Generator.create(path.join(__dirname, 'templates'), path.join(__dirname, 'files'));

generator.on('create', function (file) {
  console.log('create  %s', file);
});

generator.createFolderRecursive('./', {}, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done');
});
