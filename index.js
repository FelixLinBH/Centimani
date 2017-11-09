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

        checkPathIsExist(distPath);


		  	  //write
          fs.writeFile(distPath + name + "." + el, rendered, function (err) {
              if (err) throw err;
              console.log("The file " + distPath + name + " was saved!");
			     }); 
		  });
    });

 
  });

program.parse(process.argv);


function checkPathIsExist(path) {
  var pathArray = [];
  var temp = path.split("/");
  for (var i =  0 ; i < temp.length - 1; i++) {
    pathArray[i] = (i == 0)?temp[i] : pathArray[i-1] +  "/" +temp[i];
    
  }
  pathArray.map(function (el,index) {
    if (index > 0) {
      createFolder(el);
    }
  });
}

function createFolder(path) {
  fs.exists(path, function (exists) {
      console.log("path=> " + path);
      if (!exists) {
        fs.mkdir(path,0777, function (err) {
          if (err) throw err;
        });
      }
    });
}