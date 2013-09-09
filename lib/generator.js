'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var ejs = require('ejs');
var EventEmitter = require('events').EventEmitter;

module.exports = Generator;

function Generator(source, destination) {
  EventEmitter.call(this);
  this.source = source;
  this.destination = destination;
}

util.inherits(Generator, EventEmitter);

// source: templates 目錄
Generator.create = function (source, destination) {
  return new Generator(source, destination);
};

// 使用 ejs render template
Generator.prototype.createFile = function (file, destination, data, done) {
  file = path.join(this.source || '', file.replace(this.source || '', ''));
  destination = path.join(this.destination || '', destination);

  if (typeof data === 'function') {
    done = data;
    data = {};
  }

  var that = this;

  this.emit('render', file);

  mkdirp(path.dirname(destination), function (err) {
    if (err) {
      return done(err);
    }

    fs.readFile(file, 'utf8', function (err, content) {
      var content = ejs.render(content, data);

      that.emit('create', destination);

      fs.writeFile(destination, content, function (err) {
        that.emit('createDone', 'file', err, file);
        done(err);
      });
    });
  });

  return this;
};

// 建立目錄下所有東西
Generator.prototype.createFolderRecursive = function (folder, data, done) {
  folder = path.join(this.source, folder);

  var that = this;

  fs.exists(folder, function (exists) {
    if (!exists) {
      return done('\'' + folder + '\' does not exists.');
    }

    (function create(dir, done) {
      fs.readdir(dir, function (err, files) {
        if (err) {
          return done(err);
        }
        var i = 0;
        (function process(err) {
          if (err) {
            return done(err);
          }
          var file = files[i++];
          if (!file) {
            return done();
          }
          file = path.join(dir, file);
          fs.stat(file, function (err, stats) {
            if (err) {
              return done(err);
            }
            var destination = file.replace(that.source || '', '');
            if (stats.isFile()) {
              that.createFile(file, destination, data, process);
            } else {
              create(file, process);
            }
          });
        })();
      });
    })(folder, done);
  });
};
