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

}
