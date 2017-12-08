import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ProposalService} from "../../services/proposal.service";

@Component({
  selector: 'app-my-proposals',
  templateUrl: './my-proposals.component.html',
  styleUrls: ['./my-proposals.component.css']
})
export class MyProposalsComponent implements OnInit {

  myProposals: any[] = [];
  invitations: any[] = [];

  constructor(private router:Router, private proposalService:ProposalService) { }

  ngOnInit() {
    this.proposalService.getMyProposals().subscribe((data: any) => {
      this.myProposals = data.data;
    }, error => {
      console.log(error);
    });
    this.proposalService.getInvitedProposals().subscribe((data: any) => {
      this.invitations = data.data;
    }, error => {
      console.log(error);
    });
  }

  viewMyProposal(index: any): void {
    this.router.navigate(['/proposal',this.myProposals[index]._id]);
  }

  viewInvitedProposal(index: any): void {
    this.router.navigate(['/proposal',this.invitations[index]._id]);
  }

}
