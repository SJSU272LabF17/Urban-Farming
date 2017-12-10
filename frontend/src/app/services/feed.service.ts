import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FeedService {

  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  addNewFeed<T>(payload: any): any {
    var formData = new FormData();
    formData.append("content", payload.content);
    formData.append("contactViaPhone", payload.contactViaPhone);
    formData.append("contactViaEmail", payload.contactViaEmail);
    Array.from(payload.photoFiles).forEach(function(file,index){
      formData.append("file"+index,  file);
    });
    return this.http.post(this.host+'/feeds', formData);
  }

  updateFeed<T>(payload: any, id: any): any {
    var formData = new FormData();
    formData.append("content", payload.content);
    formData.append("contactViaPhone", payload.contactViaPhone);
    formData.append("contactViaEmail", payload.contactViaEmail);
    formData.append("photos", payload.photos);
    Array.from(payload.photoFiles).forEach(function(file,index){
      formData.append("file"+index,  file);
    });
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
