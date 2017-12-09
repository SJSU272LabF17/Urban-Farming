import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '@agm/core';
import {ModalService} from "../../modal/modal.service";
import {ProposalService} from "../../services/proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user.service";

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

  constructor(private router:Router, private route:ActivatedRoute, private modalService:ModalService, private userService:UserService, private proposalService:ProposalService, private authService:AuthService) { }

  ngOnInit() {
    this.getProposalDetails();
    this.getProposalMessages();
  }

  getProposalDetails(): void {
    this.proposalService.getProposalById(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this.proposalData = data.data;
    }, error => {
      console.log(error);
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
      //TODO: show success notification
      this.router.navigate(['/']);
    }, error => {
      //TODO: show error notification
      console.log(error);
    });
  }

  saveProposal(asDraft: boolean): void {
    //TODO: validation
    var payload = this.proposalData;
    payload.asDraft = asDraft;
    this.proposalService.updateProposal(payload,this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      //TODO: show success notification
      this.getProposalDetails();
    }, error => {
      //TODO: show error notification
      console.log(error);
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
      //TODO: show success notification
      this.modalService.close('confirm-proposal');
      this.getProposalDetails();
    }, error => {
      //TODO: show error notification
      console.log(error);
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
        //TODO: show success notification
        this.newMessageText = "";
        this.getProposalMessages();
      }, error => {
        //TODO: show error notification
        console.log(error);
      });
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
