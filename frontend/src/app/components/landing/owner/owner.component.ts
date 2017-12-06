import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    //TODO: call api to get all the proposals for the logged in user's all farms
  }

  viewProposal(id: any) : void {
    this.router.navigate(['/proposal',id]);
  }

}
