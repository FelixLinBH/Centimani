//centimani new controller test
var setting = require('./setting.json')
var fs = require('fs');
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

		        checkPathIsExist(distPath).then(function(){
		        	writePromise(distPath + name + "." + el,rendered);
		        }).catch((err) => {console.log(err.message)})

		  });
    });

 
  });

program.parse(process.argv);

function parsePath(path){
  var pathArray = [];
  var temp = path.split("/");
  for (var i =  0 ; i < temp.length - 1; i++) {
    pathArray[i] = (i == 0)?temp[i] : pathArray[i-1] +  "/" +temp[i]; 
  }
  
  return pathArray;
}

function checkPathIsExist(path) {
  
	var promiseArray = parsePath(path).map(function (el,index) {
		if (index > 0) {
		  return createFolder(el);
		}
	}).filter(function(elem, index, array){
		return (elem != undefined)
	})

	return new Promise(function(resolve, reject) {
		Promise.all(promiseArray).then(function(value) {
			resolve();
		}).catch(function(err) {
			reject(err);
		})
	});
	
}


function createFolder(path) {
	return new Promise(function(resolve, reject) {
		isExistsPromise(path).then(function(value) {
		  mkDirPromise(path).then(function(){
		  	 resolve();
		  },function(reason){
		  	reject(new Error('Create '+path+' is failed.'))		  	 
		  });
		}, function(reason) {
		  //File is exists.
		  resolve();
		})
	});
}

function isExistsPromise(path){
	return new Promise(function(resolve, reject) {
		fs.exists(path, function (exists) {
			if (!exists) resolve();
			reject(new Error('File is exists.'))
		});
	});
}

function mkDirPromise(path){
	return new Promise(function(resolve, reject) {
	 fs.mkdir(path,0777, function (err) {
          if (err && err.code != 'EEXIST') {
          	console.log(err);
          	reject(err);
          }
          resolve();
        });
	});
}

function writePromise(path,data){
	return new Promise(function(resolve, reject) {
		fs.writeFile(path, data, function (err) {
          if (err) reject(err);
          resolve();
		});
	});
}

