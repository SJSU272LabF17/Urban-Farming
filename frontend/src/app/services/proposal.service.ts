import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ProposalService {

  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  createProposal<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/proposals', JSON.stringify(payload));
  }

  updateProposal<T>(payload: any, id: any): Observable<T> {
    return this.http.put<T>(this.host+'/proposals/'+id, JSON.stringify(payload));
  }

  getMyProposals<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/proposals');
  }

  getInvitedProposals<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/proposals?type=invitations');
  }

  getProposalById<T>(id: any): Observable<T> {
    return this.http.get<T>(this.host+'/proposals/'+id);
  }

  deleteProposal<T>(id: any): Observable<T> {
    return this.http.delete<T>(this.host+'/proposals/'+id);
  }

  takeAction<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/proposals/action', JSON.stringify(payload));
  }

  sendMessageToProposal<T>(payload: any, id: any): Observable<T> {
    return this.http.post<T>(this.host+'/proposals/'+id+'/messages', JSON.stringify(payload));
  }

  getMessagesForProposals<T>(id: any): Observable<T> {
    return this.http.get<T>(this.host+'/proposals/'+id+'/messages');
  }

}
