import { Component, OnInit } from '@angular/core';
import {ForumService} from "../../services/forum.service";
import {SharedService} from "../../services/shared.service";
import {ModalService} from "../../modal/modal.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {

  topics: any[] = [];

  newTopicText: string = '';

  constructor(private forumService:ForumService, private sharedService:SharedService, private modalService:ModalService, private authService:AuthService, private router:Router, private _alert:AlertsService) { }

  ngOnInit() {
    this.getAllForumTopics();
  }

  getAllForumTopics(): void {
    this.forumService.getAllForumTopics().subscribe((data: any) => {
      this.topics = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching topics');
    })
  }

  openNewTopic(): void {
    if(this.authService.isLogged){
      this.newTopicText = '';
      this.modalService.open('new-topic');
    } else {
      this.sharedService.openAuthModal();
    }
  }

  closeNewTopic(): void {
    this.modalService.close('new-topic');
  }

  createNewTopic(): void {
    this.forumService.createForumTopic({title:this.newTopicText}).subscribe((data: any) => {
      this._alert.create('success', 'Successfully created new topic');
      this.modalService.close('new-topic');
      this.router.navigate(['/forums',data.data._id]);
    }, error => {
      this._alert.create('error', 'There was some error in creating new topic');
    })
  }

}
