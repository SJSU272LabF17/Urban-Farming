import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../modal/modal.service";
import {FeedService} from "../../services/feed.service";

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

  constructor(private modalService:ModalService, private feedService:FeedService) { }

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
      console.log(error);
    });
  }

  saveFeed() : void {
    //TODO: validation
    if(this.editId){
      this.feedService.updateFeed(this.feedData,this.editId).subscribe((data: any) => {
        //TODO: show success notification
        this.getMyFeeds();
        this.modalService.close('feed-form');
      }, error => {
        //TODO: show error notification
        console.log(error);
      });
    } else {
      this.feedService.addNewFeed(this.feedData).subscribe((data: any) => {
        //TODO: show success notification
        this.getMyFeeds();
        this.modalService.close('feed-form');
      }, error => {
        //TODO: show error notification
        console.log(error);
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
        //TODO: show success notification
        this.getMyFeeds();
        this.modalService.close('delete-feed');
      }, error => {
        //TODO: show error notification
        console.log(error);
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
