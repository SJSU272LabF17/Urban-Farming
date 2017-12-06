import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  mapView: boolean = false;

  @ViewChild('farmMap') map: AgmMap;

  constructor() { }

  ngOnInit() {
    //TODO: fetch proposal info by param id,
    //TODO: API should check if this user is allowed to view this proposal or not, show content on UI accordingly
  }

}
