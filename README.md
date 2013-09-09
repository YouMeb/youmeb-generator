youmeb-generator
================

    var path = require('path');
    var generator = require('youmeb-generator')
      .create(path.join(__dirname, './templates'), path.join(__dirname, './newApp'));

    generator.createFolderRecursive('./', {
      hello: 'world'
    }, function (err) {
      console.error(err);
    });
    
