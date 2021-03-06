var core = require('./lib')
var fs = require('fs')
var setting,key;

var program = require('commander');
program
  .command('init')
  .description('init new setting json')
  .action(function (options) {

    core.run('init').then(
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
   setting = JSON.parse(fs.readFileSync('./setting.json', 'utf8'));
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

    var job = Object.keys(setting[target]).map(function(el){
      return core.run( 'new',name,setting[target][el])
    });

    Promise.all(job).then(
      function fulfilled(){
        console.log("success created %s",name);
      },
      function rejected(reason){
        console.log("wrong =>" + reason)
      }
    );
  
  });

program.parse(process.argv);





