import 'js/enviroment.js';


function getImages(){
  fetch('http://example.com/movies.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });

}

console.log(enviroment);

getImages();
