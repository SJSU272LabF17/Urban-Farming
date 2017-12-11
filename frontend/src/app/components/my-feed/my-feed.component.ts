import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../modal/modal.service";
import {FeedService} from "../../services/feed.service";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-my-feed',
  templateUrl: './my-feed.component.html',
  styleUrls: ['./my-feed.component.css']
})
export class MyFeedComponent implements OnInit {

  feedData: any = {
    content: '',
    contactViaPhone: true,
    contactViaEmail: true
  };

  feeds: any[] = [];

  deleteId: any;
  editId: any;

  constructor(private modalService:ModalService, private feedService:FeedService, private _alert:AlertsService) { }

  ngOnInit() {
    this.getMyFeeds();
  }

  openAddNewFeed() : void {
    this.feedData = {
      content: '',
      contactViaPhone: true,
      contactViaEmail: true
    };
    this.feedData.photoFiles = [];
    (<HTMLInputElement>document.getElementById("fileUploads")).value = "";
    this.modalService.open('feed-form');
  }

  openEditFeed(index: any) : void {
    this.editId = this.feeds[index]._id;
    this.feedData = {
      content: this.feeds[index].content,
      contactViaPhone: this.feeds[index].contactViaPhone,
      contactViaEmail: this.feeds[index].contactViaEmail,
      photos: this.feeds[index].photos
    };
    this.feedData.photoFiles = [];
    (<HTMLInputElement>document.getElementById("fileUploads")).value = "";
    this.modalService.open('feed-form');
  }

  closeFeedForm() : void {
    this.editId = null;
    this.modalService.close('feed-form');
  }

  getMyFeeds(): void {
    this.feedService.getMyFeeds().subscribe((data: any) => {
      this.feeds = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching your feeds');
    });
  }

  saveFeed() : void {
    if(this.feedData.content.length === 0){
      this._alert.create('warning', 'Content for the feed cannot be empty');
      return;
    }
    if(this.editId){
      this.feedService.updateFeed(this.feedData,this.editId).subscribe((data: any) => {
        this._alert.create('success', 'Successfully updated feed details');
        this.getMyFeeds();
        this.modalService.close('feed-form');
      }, error => {
        this._alert.create('error', 'There was some error in updating feed');
      });
    } else {
      this.feedService.addNewFeed(this.feedData).subscribe((data: any) => {
        this._alert.create('success', 'Successfully created new feed');
        this.getMyFeeds();
        this.modalService.close('feed-form');
      }, error => {
        this._alert.create('error', 'There was some error in creating new feed');
      });
    }
  }

  openDeleteFeed(index: any) : void {
    this.deleteId = this.feeds[index]._id;
    this.modalService.open('delete-feed');
  }

  closeDeleteFeed() : void {
    this.deleteId = null;
    this.modalService.close('delete-feed');
  }

  deleteFeed() : void {
    if(this.deleteId){
      this.feedService.deleteFeed(this.deleteId).subscribe((data: any) => {
        this._alert.create('success', 'Successfully deleted the feed');
        this.getMyFeeds();
        this.modalService.close('delete-feed');
      }, error => {
        this._alert.create('error', 'There was some error in deleting the feed');
      });
    }
  }

  removeImage(index: any): void {
    this.feedData.photos.splice(index);
  }

  onFileUpload(e: any): void {
    this.feedData.photoFiles = e.target.files;
  }

}
