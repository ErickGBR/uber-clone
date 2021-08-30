/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable max-len */
import { Component, OnInit, ViewChild, AfterContentInit} from '@angular/core';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, MyLocation} from '@ionic-native/google-maps';
import { Platform, LoadingController } from '@ionic/angular';

declare const google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map') mapElement: any;
  private loading: any;
  private map: GoogleMap;
  public search: string ='';
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  public searchResults = new Array<any>();

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController
    ) {
      console.log(google);
    }

  ngOnInit() {
      setTimeout(() =>{
      console.log('setimeout',this);
      this.mapElement = this.mapElement.nativeElement;

      this.mapElement.style.width = this.platform.width() + 'px';
      this.mapElement.style.height = this.platform.height() + 'px';

      this.loadMap();

    },2000);
  }


  async loadMap() {
    this.loading = await this.loadingCtrl.create({ message: 'Loading...' });
    await this.loading.present();


    // eslint-disable-next-line @typescript-eslint/naming-convention
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Environment.setEnv({ API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyBX78unviQPf4l9BjhKFhq6-pQrMXfVjic',API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyBX78unviQPf4l9BjhKFhq6-pQrMXfVjic' });
    /*
    setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBX78unviQPf4l9BjhKFhq6-pQrMXfVjic',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBX78unviQPf4l9BjhKFhq6-pQrMXfVjic'
    });
    */

    const mapOptions: GoogleMapOptions = {
        controls:{
          zoom:false,
        }
    };

    this.map = GoogleMaps.create(this.mapElement, mapOptions);

    try{
      await this.map.one(GoogleMapsEvent.MAP_READY);
      this.addOriginMarker();
    }catch(error){
      console.error(error);
    };

  };

  async addOriginMarker(){
    try{
      const myLocation: MyLocation = await this.map.getMyLocation();
      console.log(myLocation);

      await this.map.moveCamera({
        target:myLocation.latLng,
        zoom:18
      });

      this.map.addMarkerSync({
        title:'Origem',
        icon:'#000',
        animation: GoogleMapsAnimation.DROP,
        position: myLocation.latLng
      });

    }catch(error){
      console.error(error);
    }finally{
      this.loading.dismiss();
    }

  };


  searchChanged(){
    // eslint-disable-next-line curly
    if(!this.search.trim().length) return;
    this.googleAutocomplete.getPlacePredictions({ input: this.search }, predictions => {
      console.log(predictions);
      this.searchResults = predictions;
    });
  }

}
