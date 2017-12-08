import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";
import {ProposalService} from "../../services/proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  zoom: number = 12;

  @ViewChild('farmMap') map: AgmMap;

  editView: string;

  proposalData: any = {createdBy:{},invitedUsers:[],farm:{location:[-121.8863,37.3369],owner:{}}};

  proposalMessages: any[] = [];

  newMessageText: string = '';

  constructor(private router:Router, private route:ActivatedRoute, private modalService:ModalService, private proposalService:ProposalService, private authService:AuthService) { }

  ngOnInit() {
    this.proposalService.getProposalById(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this.proposalData = data.data;
    }, error => {
      console.log(error);
    });
    this.getProposalMessages();
  }

  openEditProposal(editView: string): void {
    this.editView = editView;
    this.modalService.open('edit-proposal');
  }

  closeEditProposal(): void {
    this.modalService.close('edit-proposal');
  }

  saveProposalTemp(): void {
    //TODO: save proposal temporarily on frontend
    this.modalService.close('edit-proposal');
  }

  openDeleteProposal(): void {
    this.modalService.open('delete-proposal');
  }

  closeDeleteProposal(): void {
    this.modalService.close('delete-proposal');
  }

  deleteProposal(): void {
    this.proposalService.deleteProposal(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      //TODO: show success notification
      this.router.navigate(['/']);
    }, error => {
      //TODO: show error notification
      console.log(error);
    });
  }

  saveProposal(asDraft: boolean): void {
    if(asDraft){
      //TODO: save as draft
    } else {
      //TODO: submit
    }
  }

  takeAction(): void {
    //TODO: take action
  }

  getProposalMessages(): void {
    this.proposalService.getMessagesForProposals(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this.proposalMessages = data.data;
    }, error => {
      console.log(error);
    });
  }

  sendMessage(): void {
    if(this.newMessageText.length > 0) {
      this.proposalService.sendMessageToProposal({message:this.newMessageText},this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
        //TODO: show success notification
        this.newMessageText = "";
        this.getProposalMessages();
      }, error => {
        //TODO: show error notification
        console.log(error);
      });
    }
  }

}
