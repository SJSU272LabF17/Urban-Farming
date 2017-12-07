import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  zoom: number = 12;

  lat: number = 37.3369;
  lng: number = -121.8863;

  @ViewChild('farmMap') map: AgmMap;

  editView: string;

  constructor(private modalService:ModalService) { }

  ngOnInit() {
    //TODO: fetch proposal info by param id,
    //TODO: API should check if this user is allowed to view this proposal or not, show content on UI accordingly
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
    //TODO: delete proposal
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

  sendMessage(): void {
    //TODO: send message
  }

}
