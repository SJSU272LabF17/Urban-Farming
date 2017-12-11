import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ProposalService} from "../../services/proposal.service";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-my-proposals',
  templateUrl: './my-proposals.component.html',
  styleUrls: ['./my-proposals.component.css']
})
export class MyProposalsComponent implements OnInit {

  myProposals: any[] = [];
  invitations: any[] = [];

  constructor(private router:Router, private proposalService:ProposalService, private _alert:AlertsService) { }

  ngOnInit() {
    this.proposalService.getMyProposals().subscribe((data: any) => {
      this.myProposals = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching your proposals');
    });
    this.proposalService.getInvitedProposals().subscribe((data: any) => {
      this.invitations = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching proposal invitations');
    });
  }

  viewMyProposal(index: any): void {
    this.router.navigate(['/proposal',this.myProposals[index]._id]);
  }

  viewInvitedProposal(index: any): void {
    this.router.navigate(['/proposal',this.invitations[index]._id]);
  }

}
