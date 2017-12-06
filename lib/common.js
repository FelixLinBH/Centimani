const fs = require('fs');
const fsExtra = require('fs-extra')
const Mustache = require('Mustache');

exports.writePromise = function (path,data){
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, data, function (err) {
          if (err) reject(err);
          resolve();
    });
  });
}

exports.mkdirpASync = function (dirPath) {
  return new Promise(function(resolve, reject) {
    fsExtra.mkdirs(dirPath, function (err) {
      if (err) return creject(err)
      resolve();
    })
  }); 
}

exports.appendFilePromise = function (path,data){
  return new Promise(function(resolve, reject) {
    fs.appendFile(path, data + '\n', function (err) {
          if (err) reject(err);
          resolve();
    });
  });
}

exports.readFilePromise = function (path){
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function (err,data) {
          if (err) reject(err);
          resolve(data);
    });
  });
}

exports.parseDataPromise = function (data,name) {
  return new Promise(function(resolve, reject) {
      //preparse
      Mustache.parse(data); 
      var rendered = Mustache.render(data, {class_name: name});
      resolve(rendered);
  });
}

