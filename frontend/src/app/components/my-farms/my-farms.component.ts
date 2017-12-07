import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";
import {GoogleMapsService} from "../../services/google-maps.service";
import {FarmService} from "../../services/farm.service";

@Component({
  selector: 'app-my-farms',
  templateUrl: './my-farms.component.html',
  styleUrls: ['./my-farms.component.css']
})
export class MyFarmsComponent implements OnInit {

  markerLat: number;
  markerLng: number;

  zoom: number = 12;

  @ViewChild('farmMap') map: AgmMap;

  farmData: any = {
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

  farms: any[] = [];

  currentCountry: string = '';

  deleteId: any;
  editId: any;

  constructor(private modalService:ModalService, private gMapsService:GoogleMapsService, private __zone: NgZone, private farmService:FarmService) { }

  ngOnInit() {
    this.getMyFarms();
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

  openEditFarm(index: any) : void {
    this.editId = this.farms[index]._id;
    this.farmData = {
      streetAddress: this.farms[index].streetAddress,
      city: this.farms[index].city,
      state: this.farms[index].state,
      zipCode: this.farms[index].zipCode,
      lat : this.farms[index].location[1],
      lng : this.farms[index].location[0],
      size : this.farms[index].size,
      waterConn : this.farms[index].waterConn,
      waterAlternative : this.farms[index].waterAlternative,
      appliedWaterConn : this.farms[index].appliedWaterConn,
      existingStructures : this.farms[index].existingStructures
    };
    this.currentCountry = "US";
    this.markerLat = this.farms[index].location[1];
    this.markerLng = this.farms[index].location[0];
    this.modalService.open('farm-form');
    this.map.triggerResize();
  }

  closeFarmForm() : void {
    this.editId = null;
    this.modalService.close('farm-form');
  }

  getMyFarms(): void {
    this.farmService.getMyFarms().subscribe((data: any) => {
      this.farms = data.data;
    }, error => {
      console.log(error);
    });
  }

  saveFarm() : void {
    if(this.currentCountry === 'US'){
      //TODO: validation
      if(this.editId){
        this.farmService.updateFarm(this.farmData,this.editId).subscribe((data: any) => {
          //TODO: show success notification
          this.getMyFarms();
          this.modalService.close('farm-form');
        }, error => {
          //TODO: show error notification
          console.log(error);
        });
      } else {
        this.farmService.addNewFarm(this.farmData).subscribe((data: any) => {
          //TODO: show success notification
          this.getMyFarms();
          this.modalService.close('farm-form');
        }, error => {
          //TODO: show error notification
          console.log(error);
        });
      }
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
              _this.farmData.state = component.short_name;
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

  openDeleteFarm(index: any) : void {
    this.deleteId = this.farms[index]._id;
    this.modalService.open('delete-farm');
  }

  closeDeleteFarm() : void {
    this.deleteId = null;
    this.modalService.close('delete-farm');
  }

  deleteFarm() : void {
    if(this.deleteId){
      this.farmService.deleteFarm(this.deleteId).subscribe((data: any) => {
        //TODO: show success notification
        this.getMyFarms();
        this.modalService.close('delete-farm');
      }, error => {
        //TODO: show error notification
        console.log(error);
      });
    }
  }

}
