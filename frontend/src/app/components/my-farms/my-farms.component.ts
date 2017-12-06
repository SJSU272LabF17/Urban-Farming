import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";
import {GoogleMapsService} from "../../services/google-maps.service";

@Component({
  selector: 'app-my-farms',
  templateUrl: './my-farms.component.html',
  styleUrls: ['./my-farms.component.css']
})
export class MyFarmsComponent implements OnInit {

  markerLat: number;
  markerLng: number;
  mapView: boolean = false;

  @ViewChild('farmMap') map: AgmMap;

  farmData: Object = {
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    lat : 37.3369,
    lng : -121.8863,
    size : '',
    waterConn : 'YES',
    waterAlternative : '',
    appliedWaterConn : 'NO',
    existingStructures : ''
  };

  currentCountry: string = '';

  constructor(private modalService:ModalService, private gMapsService:GoogleMapsService, private __zone: NgZone) { }

  ngOnInit() {
    //TODO: call api to get all the farms of logged in user
  }

  openAddNewFarm() : void {
    this.farmData = {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      lat : 37.3369,
      lng : -121.8863,
      size : '',
      waterConn : 'YES',
      waterAlternative : '',
      appliedWaterConn : 'NO',
      existingStructures : ''
    };
    this.currentCountry = "";
    this.markerLat = null;
    this.markerLng = null;
    this.modalService.open('farm-form');
    this.map.triggerResize();
  }

  openEditFarm() : void {
    //TODO: call api to fetch data for this farm
    this.farmData = {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      lat : 37.3369,
      lng : -121.8863,
      size : '',
      waterConn : 'YES',
      waterAlternative : '',
      appliedWaterConn : 'NO',
      existingStructures : ''
    };
    this.currentCountry = "";
    this.markerLat = 37.3369;
    this.markerLng = -121.8863;
    this.modalService.open('farm-form');
    this.map.triggerResize();
  }

  closeFarmForm() : void {
    this.modalService.close('farm-form');
  }

  saveFarm() : void {
    if(this.currentCountry === 'US'){
      //TODO: validation, create or update based on if id is present or not
    } else {
      //TODO: show error
      console.log("Not in USA");
    }
  }

  getLocation(e) : void {
    this.farmData.streetAddress = "";
    this.farmData.city = "";
    this.farmData.state = "";
    this.farmData.zipCode = "";
    //this.farmData.lat = 37.3369;
    //this.farmData.lng = -121.8863;
    var _this = this;
    this.gMapsService.getAddress(e.coords.lat,e.coords.lng)
      .subscribe(
        result => {
          _this.__zone.run(() => {
            _this.markerLat = e.coords.lat;
            _this.markerLng = e.coords.lng;
          })
          _this.farmData.lat = e.coords.lat;
          _this.farmData.lng = e.coords.lng;
          result.address_components.forEach(function(component){
            if(component.types.indexOf('street_number') > -1) {
              _this.farmData.streetAddress += component.long_name;
            } else if(component.types.indexOf('route') > -1) {
              if(_this.farmData.streetAddress.length > 0){
                _this.farmData.streetAddress += " ";
              }
              _this.farmData.streetAddress += component.long_name;
            } else if(component.types.indexOf('locality') > -1) {
              _this.farmData.city = component.long_name;
            } else if(component.types.indexOf('administrative_area_level_1') > -1) {
              _this.farmData.state = component.long_name;
            } else if(component.types.indexOf('postal_code') > -1) {
              _this.farmData.zipCode = component.long_name;
            } else if(component.types.indexOf('country') > -1) {
              _this.currentCountry = component.short_name;
            }
          });
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }

  openDeleteFarm() : void {
    this.modalService.open('delete-farm');
  }

  closeDeleteFarm() : void {
    this.modalService.close('delete-farm');
  }

  deleteFarm() : void {
    //TODO: delete farm
  }

}
