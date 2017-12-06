import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-proposals',
  templateUrl: './my-proposals.component.html',
  styleUrls: ['./my-proposals.component.css']
})
export class MyProposalsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    //TODO: get saved proposals for logged in user
    //TODO: get submitted proposals for logged in user
    //TODO: get invitations for logged in user
  }

  viewProposal(id: any): void {
    this.router.navigate(['/proposal',id]);
  }

}
