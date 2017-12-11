import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollToFarmListings(el): void {
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }

}
