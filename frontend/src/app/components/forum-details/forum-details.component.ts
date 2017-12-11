import { Component, OnInit } from '@angular/core';
import {ForumService} from "../../services/forum.service";
import {SharedService} from "../../services/shared.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-forum-details',
  templateUrl: './forum-details.component.html',
  styleUrls: ['./forum-details.component.css']
})
export class ForumDetailsComponent implements OnInit {

  topicTitle: string = '';
  messages: any[] = [];

  newMessageText: string = '';

  constructor(private forumService:ForumService, private sharedService:SharedService, private authService:AuthService, private route:ActivatedRoute, private _alert:AlertsService) { }

  ngOnInit() {
    this.getMessagesForForum();
  }

  getMessagesForForum(): void {
    this.forumService.getMessagesForForum(this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
      this.topicTitle = data.data.topicTitle;
      this.messages = data.data.messages;
    }, error => {
      this._alert.create('error', 'There was some error in fetching forum comments');
    })
  }

  sendMessage(): void {
    if(this.authService.isLogged){
      if(this.newMessageText.length > 0) {
        this.forumService.sendMessageToForum({message: this.newMessageText}, this.route.snapshot.paramMap.get('id')).subscribe((data: any) => {
          this._alert.create('success', 'Successfully posted the comment');
          this.newMessageText = "";
          this.getMessagesForForum();
        }, error => {
          this._alert.create('error', 'There was some error in posting the comment');
        });
      }
    } else {
      this.sharedService.openAuthModal();
    }
  }

}
