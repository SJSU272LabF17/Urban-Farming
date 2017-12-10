import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { environment } from '../../environments/environment';

@Injectable()
export class ForumService {

  private host: String = environment.apiHost;

  constructor(private http: HttpClient) { }

  createForumTopic<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/forums', JSON.stringify(payload),{ headers: {'Content-Type' : 'application/json'} });
  }

  getAllForumTopics<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/forums');
  }

  sendMessageToForum<T>(payload: any, id: any): Observable<T> {
    return this.http.post<T>(this.host+'/forums/'+id+'/messages', JSON.stringify(payload),{ headers: {'Content-Type' : 'application/json'} });
  }

  getMessagesForForum<T>(id: any): Observable<T> {
    return this.http.get<T>(this.host+'/forums/'+id+'/messages');
  }

}
