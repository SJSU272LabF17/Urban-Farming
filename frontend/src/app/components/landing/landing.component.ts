import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  @ViewChild('content') private farmListings: ElementRef;

  constructor(private authService:AuthService, private sharedService:SharedService) { }

  ngOnInit() {
  }

  scrollToFarmListings(el): void {
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }

  openOwnerRegister(): void {
    this.sharedService.openOwnerRegister();
  }

}
