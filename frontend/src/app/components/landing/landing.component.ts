import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgmMap } from '@agm/core';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  mapView: boolean = false;

  @ViewChild('farmMap') map: AgmMap;
  @ViewChild('farmListings') private farmListings: ElementRef;

  constructor(private modalService:ModalService) { }

  ngOnInit() {
  }

  toggleView(): void {
    this.mapView = !this.mapView;
  }

  viewInMap(): void {
    this.modalService.open('farm-location');
    this.map.triggerResize();
  }

  scrollToFarmListings(el): void {
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }

}
