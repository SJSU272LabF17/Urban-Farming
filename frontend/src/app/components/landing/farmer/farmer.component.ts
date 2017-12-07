import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import { ModalService } from '../../../modal/modal.service';
import {AuthService} from "../../../services/auth.service";
import {SharedService} from "../../../services/shared.service";
import {FarmService} from "../../../services/farm.service";

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  lat: number = 37.3369;
  lng: number = -121.8863;
  mapView: boolean = true;

  @ViewChild('farmMap') map: AgmMap;
  @ViewChild('farmMap2') map2: AgmMap;

  farms: any[] = [];

  viewMapLat: number;
  viewMapLng: number;

  proposalData: any = {
    coverLetter: '',
    proposedUses: '',
    plannerOperations: '',
    invitedUsers: []
  };

  selectedFarm: any = {location:[]};

  constructor(private modalService:ModalService, private authService:AuthService, private sharedService:SharedService, private farmService:FarmService) { }

  ngOnInit() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.searchNearByFarms();
      }, error => {
        console.log(error);
      });
    }
  }

  searchNearByFarms(): void {
    this.farmService.searchFarms(this.lat,this.lng).subscribe((data: any) => {
      this.farms = data.data;
    }, error => {
      console.log(error);
    })
  }

  toggleView(): void {
    this.mapView = !this.mapView;
  }

  viewInMap(index: any): void {
    this.viewMapLat = this.farms[index].location[1];
    this.viewMapLng = this.farms[index].location[0];
    this.modalService.open('farm-location');
    this.map.triggerResize();
  }

  openSubmitProposal(index: any): void {
    if(this.authService.isLogged){
      this.proposalData = {
        coverLetter: '',
        proposedUses: '',
        plannerOperations: '',
        invitedUsers: []
      };
      this.selectedFarm = this.farms[index];
      this.modalService.open('new-proposal');
      this.map2.triggerResize();
    } else {
      this.sharedService.openAuthModal();
    }
  }

  closeNewProposal(): void {
    this.selectedFarm = {location:[]};
    this.modalService.close('new-proposal');
  }

  saveProposal(asDraft: boolean): void {
    //TODO: validation
    if(asDraft){
      //TODO: save as draft
    } else {
      //TODO: submit proposal
    }
  }

}
