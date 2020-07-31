var Owlbot = require('owlbot-js');
  
var client = Owlbot('3b7de2fe49777101ba7d0d2e4c0a3cd3adf5e375');
 
client.define('owl').then(function(result){
   console.log(result);
});


client.define('cat').then(function(result){
  console.log(result);
});

client.define('dog').then(function(result){
  console.log(result);
});
