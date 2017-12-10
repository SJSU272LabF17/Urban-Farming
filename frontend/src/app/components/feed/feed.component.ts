import { Component, OnInit } from '@angular/core';
import {FeedService} from "../../services/feed.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  feeds: any[] = [];
  constructor(private feedService:FeedService) { }

  ngOnInit() {
    this.getFeeds();
  }

  getFeeds(): void {
    this.feedService.searchFeeds().subscribe((data: any) => {
      this.feeds = data.data;
    }, error => {
      console.log(error);
    });
  }

}
