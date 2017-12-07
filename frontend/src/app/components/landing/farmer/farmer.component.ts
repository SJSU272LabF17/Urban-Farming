import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import { ModalService } from '../../../modal/modal.service';
import {AuthService} from "../../../services/auth.service";
import {SharedService} from "../../../services/shared.service";

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  mapView: boolean = true;

  @ViewChild('farmMap') map: AgmMap;
  @ViewChild('farmMap2') map2: AgmMap;

  proposalData: any = {
    coverLetter: '',
    proposedUses: '',
    plannerOperations: '',
    invitedUsers: []
  };

  selectedFarmId: string;

  constructor(private modalService:ModalService, private authService:AuthService, private sharedService:SharedService) { }

  ngOnInit() {
    //TODO: get all farms sorted by user's current location
    //TODO: load markers in map
  }

  toggleView(): void {
    this.mapView = !this.mapView;
  }

  viewInMap(): void {
    this.modalService.open('farm-location');
    this.map.triggerResize();
  }

  openSubmitProposal(farmId): void {
    if(this.authService.isLogged){
      this.proposalData = {
        coverLetter: '',
        proposedUses: '',
        plannerOperations: '',
        invitedUsers: []
      };
      this.selectedFarmId = farmId;
      this.modalService.open('new-proposal');
      this.map2.triggerResize();
    } else {
      this.sharedService.openAuthModal();
    }
  }

  closeNewProposal(): void {
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
