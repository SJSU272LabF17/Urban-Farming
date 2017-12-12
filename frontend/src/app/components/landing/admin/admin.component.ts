import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AgmMap} from "@agm/core";
import {ModalService} from "../../../modal/modal.service";
import {GoogleMapsService} from "../../../services/google-maps.service";
import {FarmService} from "../../../services/farm.service";
import {AlertSettings, AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

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
    existingStructures : '',
    ownerInfo:{
      ownerContactName:'',
      ownerContactPhoneNumber:'',
      ownerContactEmail:'',
      redirectURL:''
    }
  };

  farms: any[] = [];

  currentCountry: string = '';

  deleteId: any;
  editId: any;

  constructor(private modalService:ModalService, private gMapsService:GoogleMapsService, private __zone: NgZone, private farmService:FarmService, private _alert: AlertsService) { }

  ngOnInit() {
    this.getAdminFarms();
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
      existingStructures : '',
      ownerInfo:{
        ownerContactName:'',
        ownerContactPhoneNumber:'',
        ownerContactEmail:'',
        redirectURL:''
      }
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
      existingStructures : this.farms[index].existingStructures,
      ownerInfo:{
        ownerContactName:this.farms[index].ownerInfo.ownerContactName,
        ownerContactPhoneNumber:this.farms[index].ownerInfo.ownerContactPhoneNumber,
        ownerContactEmail:this.farms[index].ownerInfo.ownerContactEmail,
        redirectURL:this.farms[index].ownerInfo.redirectURL
      }
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

  getAdminFarms(): void {
    this.farmService.getAdminFarms().subscribe((data: any) => {
      this.farms = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching farms');
    });
  }

  saveFarm() : void {
    if(this.currentCountry === 'US'){
      if(this.farmData.streetAddress.length === 0 || this.farmData.city.length === 0 || this.farmData.state.length === 0 || this.farmData.zipCode.length === 0){
        this._alert.create('warning', 'Select valid location');
        return;
      }
      // if(this.farmData.size.length === 0){
      //   this._alert.create('warning', 'Size of the farm is required');
      //   return;
      // }
      // if(isNaN(this.farmData.size)){
      //   this._alert.create('warning', 'Size of the farm is invalid');
      //   return;
      // }
      // if(parseInt(this.farmData.size) < 4356 || parseInt(this.farmData.size) < 43560){
      //   this._alert.create('warning', 'Farm size cannot be less than 4356 sqft (0.1 acre) or more than 43560 sqft (1 acre)');
      //   return;
      // }
      if(this.editId){
        this.farmService.updateAdminFarm(this.farmData,this.editId).subscribe((data: any) => {
          this._alert.create('success', 'Successfully updated farm details');
          this.getAdminFarms();
          this.modalService.close('farm-form');
        }, error => {
          this._alert.create('error', 'There was some error in updating farm details');
        });
      } else {
        this.farmService.addNewAdminFarm(this.farmData).subscribe((data: any) => {
          this._alert.create('success', 'Successfully created new farm');
          this.getAdminFarms();
          this.modalService.close('farm-form');
        }, error => {
          this._alert.create('error', 'There was some error in creating new farm');
        });
      }
    } else {
      this._alert.create('warning', 'Selected location should be in USA');
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
      this.farmService.deleteAdminFarm(this.deleteId).subscribe((data: any) => {
        this._alert.create('success', 'Successfully deleted the farm');
        this.getAdminFarms();
        this.modalService.close('delete-farm');
      }, error => {
        this._alert.create('error', 'There was some error in deleting the farm');
      });
    }
  }

}
