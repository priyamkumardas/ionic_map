import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  lat;
  lng;
  map;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  location_source;
  location_destination;
  DirectionsWaypoint;
  

  constructor(private geo: Geolocation,private androidPermissions: AndroidPermissions) {}

  ionViewDidEnter() {
    this.getMyLocation();
  }


  loadMap() {
     let latLng = new google.maps.LatLng(this.lat, this.lng);
    //let latLng = new google.maps.LatLng( 22.572451, 88.422748);
   
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });


    var locations = [
      "22.572451, 88.422748",
        "22.571104, 88.426095",
        "22.576701, 88.429078",
        "22.576416, 88.430268"
    ];


    var marker, i;

    new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });
      this.directionsDisplay.setMap(this.map);

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: this.map,
        icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            }
      });

    }

    //alert(latLng);
    // new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: latLng,
    //   icon: {
    //     url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    //   }
    // });
    
  }

 

  getMyLocation() {


    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );



    var i;
    this.geo.getCurrentPosition({
      enableHighAccuracy: true
    }).then(location => {
      this.lat = location.coords.latitude;
      this.lng = location.coords.longitude
      //this.loadMap();

      this.DirectionsWaypoint = [
        
        {
          
          location:{lat: 22.571232, lng: 88.425483},
          //22.571232, 88.425483
          //lat: 22.571104, lng: 88.426095,
          stopover: false
        },{
          location:{lat: 22.576701, lng: 88.429078},
          stopover: true
        }
        
        
        
        
      ];
      // for (i = 0; i < locations.length-1; i++) { 
      //   this.location_source=locations[i];
        this.location_source="22.557784, 88.411544";
        this.location_destination= "22.576416, 88.430268";
        //this.location_destination=locations[i+1];
        //console.log(this.location_source+" "+this.location_destination);
      this.calculateAndDisplayRoute();
      //}
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }


  calculateAndDisplayRoute() {
    //let latLng = new google.maps.LatLng(latitude, this.lng);
    const that = this;
    //alert(this.location_source);
    //alert(this.location_destination);
    console.log(this.DirectionsWaypoint);
    that.directionsService.route({
      origin: this.location_source, //origin 
      destination: this.location_destination, //destination
      travelMode: 'DRIVING',
      waypoints: this.DirectionsWaypoint,
    }, (response, status) => {
      //alert(1);
      if (status === 'OK') {
        console.log(response);
        that.directionsDisplay.setDirections(response);
        this.loadMap();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


}

