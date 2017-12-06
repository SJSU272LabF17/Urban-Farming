import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import { ModalService } from '../../../modal/modal.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;
  mapView: boolean = false;

  @ViewChild('farmMap') map: AgmMap;

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

}
