//centimani new controller test
var setting = require('./setting.json')
var fs = require('fs');
var fsExtra = require('fs-extra')
var Mustache = require('Mustache');
var key = Object.keys(setting).map(function(el){
	return el;
})

console.log(key);

var program = require('commander');

program
  .command('new [target] [name]')
  .description('run new commands with ' + key.toString() )
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(target, name, options){
  	console.log(name);
  	if (key.indexOf(target) === -1) {
  		console.log('%s command not found.', target);
  		return;
  	}
    console.log('Begin creating %s %s ', name,target);
    Object.keys(setting[target]).map(function(el){

    	var tmplPath = setting[target][el]['templates'];
    	var distPath = setting[target][el]['distPath'];
    	fs.readFile(tmplPath, 'utf8', function (err,data) {
			  if (err) {
			    return console.log(err);
			  }

			  Mustache.parse(data);   // optional, speeds up future uses 
			  var rendered = Mustache.render(data, {class_name: name});
        console.log(distPath);
              mkdirpASync(distPath).then(function(){
              writePromise(distPath + name + "." + el,rendered);
            }).catch((err) => {console.log(err.message)})

		  });
    });

  
  });

program.parse(process.argv);

function writePromise(path,data){
	return new Promise(function(resolve, reject) {
		fs.writeFile(path, data, function (err) {
          if (err) reject(err);
          resolve();
		});
	});
}

const mkdirpASync = function (dirPath) {
  return new Promise(function(resolve, reject) {
    fsExtra.mkdirs(dirPath, function (err) {
      if (err) return creject(err)
      resolve();
    })
  });
  
}
