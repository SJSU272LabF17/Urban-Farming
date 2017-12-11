import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";
import {ProposalService} from "../../services/proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user.service";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  zoom: number = 12;

  @ViewChild('farmMap') map: AgmMap;

  proposalData: any = {createdBy:{},invitedUsers:[],farm:{location:[-121.8863,37.3369],owner:{}}};

  selectedFarmer: any;

  confirmStatus: string = '';

  proposalMessages: any[] = [];

  newMessageText: string = '';

  constructor(private router:Router, private route:ActivatedRoute, private modalService:ModalService, private userService:UserService, private proposalService:ProposalService, public authService:AuthService, private _alert: AlertsService) { }

  ngOnInit() {
    this.getProposalDetails();
    this.getProposalMessages();
  }

  getProposalDetails(): void {
    this.proposalService.getProposalById(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this.proposalData = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching the proposal details');
    });
  }

  openDeleteProposal(): void {
    this.modalService.open('delete-proposal');
  }

  closeDeleteProposal(): void {
    this.modalService.close('delete-proposal');
  }

  deleteProposal(): void {
    this.proposalService.deleteProposal(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this._alert.create('success', 'Successfully deleted the proposal');
      this.router.navigate(['/']);
    }, error => {
      this._alert.create('error', 'There was some error in deleting the proposal');
    });
  }

  saveProposal(asDraft: boolean): void {
    var payload = this.proposalData;
    payload.asDraft = asDraft;
    this.proposalService.updateProposal(payload,this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      if(asDraft){
        this._alert.create('success', 'Proposal saved as a draft');
      } else {
        this._alert.create('success', 'Congratulations! You have submitted the proposal to the farm owner');
      }
      this.getProposalDetails();
    }, error => {
      this._alert.create('error', 'There was some error in saving the proposal');
    });
  }

  confirmTakeAction(status: string): void {
    this.confirmStatus = status;
    this.modalService.open('confirm-proposal');
  }

  closeTakeAction(): void {
    this.confirmStatus = "";
    this.modalService.close('confirm-proposal');
  }

  takeAction(): void {
    this.proposalService.takeAction({status:this.confirmStatus,farmId:this.proposalData.farm._id},this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      if(this.confirmStatus === 'ACCEPTED') {
        this._alert.create('success', 'Congratulations! You have accepted this proposal');
      } else {
        this._alert.create('success', 'You have rejected this proposal');
      }
      this.modalService.close('confirm-proposal');
      this.getProposalDetails();
    }, error => {
      this._alert.create('error', 'There was some error in performing the action');
    });
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
        this._alert.create('success', 'Successfully posted the comment');
        this.newMessageText = "";
        this.getProposalMessages();
      }, error => {
        this._alert.create('error', 'There was some error in posting the comment');
      });
    } else {
      this._alert.create('warning', 'Comment text cannot be empty');
    }
  }

  searchFarmers = (keyword: any): Observable<any[]> => {
    if (keyword) {
      return this.userService.searchFarmers(keyword)
        .map(res => {
          return res.data;
        })
    } else {
      return Observable.of([]);
    }
  }

  farmerSelected(e): void {
    if(e._id) {
      var found = this.proposalData.invitedUsers.some(function (el) {
        return el._id === e._id;
      });
      if (!found) { this.proposalData.invitedUsers.push({_id: e._id, firstName: e.firstName, lastName: e.lastName}); }
    }
    this.selectedFarmer = null;
  }

  removeFarmer(index: any): void {
    this.proposalData.invitedUsers.splice(index);
  }

  myListFormatter(data: any): string {
    return `${data['firstName']} ${data['lastName']} - ${data['email']}`;
  }

}
