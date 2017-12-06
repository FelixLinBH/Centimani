var common = require('./common.js')

function* injectionAction(name,ele) {
  try {
    var currentData = yield common.readFilePromise(ele.distPath);
    var val1 = yield common.readFilePromise(ele.templates);
    var val2 = yield common.parseDataPromise(val1,name);
    if (currentData.indexOf(val2) == -1) {
         var val3 = yield common.appendFilePromise(ele.distPath,val2);
    }
   
  }catch (err){
    console.error( err );
  }
}

function* newAction(name,type,ele) {
  try {
    var val1 = yield common.readFilePromise(ele['templates']);
    var val2 = yield common.parseDataPromise(val1,name);
    var val3 = yield common.mkdirpASync(ele['distPath']);
    var val4 = yield common.writePromise(ele['distPath'] + name + "." + type,val2);
    if (ele['injectionFile'] != undefined) {
      ele['injectionFile'].map(function (item) {
        run( name,'',item,'injectionFile')
      })
    } 
    
  }
  catch (err) {
    console.error( err );
  }
}

function run(name,type,ele,action) {
    var it;
    switch(action){
      case 'new':
        it = newAction(name,type,ele);
        break;
      case 'injectionFile':
        it = injectionAction(name,ele);
        break;
    }

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

exports.run =  run;