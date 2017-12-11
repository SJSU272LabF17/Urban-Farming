import { Component, OnInit } from '@angular/core';
import {FeedService} from "../../services/feed.service";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  feeds: any[] = [];
  constructor(private feedService:FeedService, private _alert:AlertsService) { }

  ngOnInit() {
    this.getFeeds();
  }

  getFeeds(): void {
    this.feedService.searchFeeds().subscribe((data: any) => {
      this.feeds = data.data;
    }, error => {
      this._alert.create('error', 'There was some error in fetching feeds');
    });
  }

}
