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

			  console.log(rendered);
		  	  //write
		  	  fs.writeFile(distPath + name, rendered, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			   console.log("The file " + distPath + name + " was saved!");
			}); 
		});
    });

 
  });
program.parse(process.argv);


// program
//   .version('0.0.1')
//   .option('-p, --peppers', 'Add peppers')
//   .option('-P, --pineapple', 'Add pineapple')
//   .option('-b, --bbq-sauce', 'Add bbq sauce')
//   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//   .parse(process.argv);

// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);
