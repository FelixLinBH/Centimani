//centimani new controller test
var setting = require('./setting.json')
var fs = require('fs');
var fsExtra = require('fs-extra')
var Mustache = require('Mustache');
var key = Object.keys(setting).map(function(el){
	return el;
})

const writePromise = function (path,data){
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

const appendFilePromise = function (path,data){
  return new Promise(function(resolve, reject) {
    fs.appendFile(path, data, function (err) {
          if (err) reject(err);
          resolve();
    });
  });
}

const readFilePromise = function (path){
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function (err,data) {
          if (err) reject(err);
          resolve(data);
    });
  });
}

const parseDataPromise = function (data,name) {
  return new Promise(function(resolve, reject) {
      //preparse
      Mustache.parse(data); 
      var rendered = Mustache.render(data, {class_name: name});
      resolve(rendered);
  });
}

function* newAction(tmplPath,name,distPath,el) {
  try {
    var val1 = yield readFilePromise(tmplPath);
    var val2 = yield parseDataPromise(val1,name);
    var val3 = yield mkdirpASync(distPath);
    var val4 = yield writePromise(distPath + name + "." + el,val2);
  }
  catch (err) {
    console.error( err );
  }
}

function run(tmplPath,name,distPath,el) {
    var it = newAction(tmplPath,name,distPath,el);
    
    return Promise.resolve()
      .then( function handleNext(value){
        var next = it.next( value );

        return (function handleResult(next){
          if (next.done) {
            return next.value;
          }
          else {
            return Promise.resolve( next.value )
              .then(
                handleNext,
                function handleErr(err) {
                  return Promise.resolve(
                    it.throw( err )
                  )
                  .then( handleResult );
                }
              );
          }
        })( next );
      } );
}

var program = require('commander');
program
  .command('init [target] [type]')
  .description('init new command')
  .action(function (target,type,options) {
    console.log(target);
  });


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
      run( tmplPath,name,distPath,el )
      .then(
        function fulfilled(){
          console.log("success")
        },
        function rejected(reason){
          console.log("wrong =>" + reason)
        }
      );

    	
      if (setting[target][el]['injectionFile'] != undefined) {
        console.log("found injectionFile setting!");
        
      }


    });

  
  });

program.parse(process.argv);




