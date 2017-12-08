import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ForumService {

  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  createForumTopic<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/forums', JSON.stringify(payload));
  }

  getAllForumTopics<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/forums');
  }

  sendMessageToForum<T>(payload: any, id: any): Observable<T> {
    return this.http.post<T>(this.host+'/forums/'+id+'/messages', JSON.stringify(payload));
  }

  getMessagesForForum<T>(id: any): Observable<T> {
    return this.http.get<T>(this.host+'/forums/'+id+'/messages');
  }

}
