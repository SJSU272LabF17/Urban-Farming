import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { environment } from '../../environments/environment';

@Injectable()
export class FeedService {

  private host: String = environment.apiHost;

  constructor(private http: HttpClient) { }

  addNewFeed<T>(payload: any): any {
    var formData = new FormData();
    formData.append("content", payload.content);
    formData.append("contactViaPhone", payload.contactViaPhone);
    formData.append("contactViaEmail", payload.contactViaEmail);
    for(var i=0;i<payload.photoFiles.length;i++){
      formData.append(payload.photoFiles[i].name,  payload.photoFiles[i]);
    }
    return this.http.post(this.host+'/feeds', formData);
  }

  updateFeed<T>(payload: any, id: any): any {
    var formData = new FormData();
    formData.append("content", payload.content);
    formData.append("contactViaPhone", payload.contactViaPhone);
    formData.append("contactViaEmail", payload.contactViaEmail);
    formData.append("photos", payload.photos);
    for(var i=0;i<payload.photoFiles.length;i++){
      formData.append(payload.photoFiles[i].name,  payload.photoFiles[i]);
    }
    return this.http.put(this.host+'/feeds/'+id, formData);
  }

  getMyFeeds<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/myfeeds');
  }

  deleteFeed<T>(id: any): Observable<T> {
    return this.http.delete<T>(this.host+'/feeds/'+id);
  }

  searchFeeds<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/feeds');
  }

}
