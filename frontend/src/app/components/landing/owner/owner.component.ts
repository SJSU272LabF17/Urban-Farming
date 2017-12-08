import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {ProposalService} from "../../../services/proposal.service";

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  myProposals: any[] = [];

  constructor(private router:Router, private proposalService:ProposalService) { }

  ngOnInit() {
    this.proposalService.getMyProposals().subscribe((data: any) => {
      this.myProposals = data.data;
    }, error => {
      console.log(error);
    });
  }

  viewProposal(index: any) : void {
    this.router.navigate(['/proposal',this.myProposals[index]._id]);
  }

}
