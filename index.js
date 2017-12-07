var core = require('./lib')
var setting,key;

var program = require('commander');
program
  .command('init')
  .description('init new setting json')
  .action(function (options) {

    core.run('','','','init').then(
        function fulfilled(){
          console.log("success created setting.json file.")
          return;
        },
        function rejected(reason){
          console.log("wrong =>" + reason)
          return;
        }
      );
  });

if (process.argv[process.argv.length - 1] != 'init') {
  try {
   setting= require('./setting.json')
  }
  catch (err) {

      program.parse(process.argv);
      console.error( "Setting.json is not found!! Please use init instruction.");
      return;
  }
  key = Object.keys(setting).map(function(el){
    return el;
  })
}else{
  program.parse(process.argv);
  return;
}



program
  .command('new [target] [name]')
  .description('run new commands with ' + key.toString() )
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(target, name, options){
    if (target === undefined) {
      console.log('target command is missed!');
      return;
    }
    if (name === undefined) {
      console.log('name is missed!', target);
      return;
    }
  	if (key.indexOf(target) === -1) {
  		console.log('%s command not found.', target);
  		return;
  	}
    
    console.log('Begin creating %s %s ', name,target);
    Object.keys(setting[target]).map(function(el){
      core.run( name,el,setting[target][el],'new')
      .then(
        function fulfilled(){
          console.log("success created %s %s",name,target);
        },
        function rejected(reason){
          console.log("wrong =>" + reason)
        }
      );

    });

  
  });

program.parse(process.argv);





