//centimani new controller test
var setting = require('./setting.json')
var core = require('./lib')
var key = Object.keys(setting).map(function(el){
	return el;
})



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
      core.run( name,el,setting[target][el],'new')
      .then(
        function fulfilled(){
          console.log("success")
        },
        function rejected(reason){
          console.log("wrong =>" + reason)
        }
      );

    });

  
  });

program.parse(process.argv);




