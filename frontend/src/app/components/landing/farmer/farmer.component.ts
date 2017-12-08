import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl } from "@angular/forms";
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ModalService } from '../../../modal/modal.service';
import {AuthService} from "../../../services/auth.service";
import {SharedService} from "../../../services/shared.service";
import {FarmService} from "../../../services/farm.service";
import {ProposalService} from "../../../services/proposal.service";
import {Router} from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  zoom: number = 12;

  lat: number = 37.3369;
  lng: number = -121.8863;
  mapView: boolean = true;

  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;

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

  constructor(private router:Router, private modalService:ModalService, private authService:AuthService, private sharedService:SharedService, private farmService:FarmService, private proposalService:ProposalService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

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

    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: any = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.searchNearByFarms();
        });
      });
    });
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
    var payload = this.proposalData;
    payload.farm = this.selectedFarm._id;
    payload.asDraft = asDraft;
    this.proposalService.createProposal(payload).subscribe((data: any) => {
      //TODO: show success notification
      this.modalService.close('new-proposal');
      this.router.navigate(['/proposal',data.data._id]);
    }, error => {
      //TODO: show error notification
      console.log(error);
    });
  }

}
