require("@babel/polyfill");
import fetchJsonp from 'fetch-jsonp';
import {
  Howl,
  Howler
} from 'howler';



class main {
  constructor() {
    this.images = null;
    this.endpoint = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=cats&tagmode=any"; //If this would be a real app we should use a data-manager
    this.error = false;
    this.galleryElement = null;
    this.infoElement = null;
    this.activated();
  }
  activated() {
    //Add some awesome tunes
    //Maybe build a music-helper that would auto handle "all" of this
    this.clickSound = new Howl({
      src: ["./resources/meow.wav"]
    });

    //When dom is loaded we want to add some nice sound effects
    document.addEventListener("DOMContentLoaded", (event) => {
      this.galleryElement = document.getElementById("gallery");
      this.infoElement = document.getElementById("info");
      this.fetchData();

      //Add that dank meow
      document.body.addEventListener("click", (event) => {

        this.clickSound.play();
      });

    });

  }

  fetchData() {
    const result = fetchJsonp(this.endpoint, {
      jsonpCallback: "jsoncallback",
      timeout: 3000
    });

    result
      .then(response => response.json())
      .then(json => {
        this.images = json.items;
        this.generateView();

      })
      .catch((err) => {
        console.log("error",err,result);
        this.error = true;
        this.generateView();
      });
  }

  generateView() {
    this.galleryElement.innerHTML = ""; //Reset on start
    if(this.error){
      this.infoElement.innerHTML = "";
      this.galleryElement.innerHTML += "<div class='innerWrapper flex-center'>Could not fetch data</div>";
    } else {
    for (let image of this.images) {
        this.galleryElement.innerHTML += "<div class='image'><img src='" + image.media.m + "'></div>";
      }
    }

  }

}


let app = new main();
