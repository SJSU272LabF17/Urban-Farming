import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {

  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  searchFarmers(q: string): any {
    return this.http.get(this.host+'/farmers?q='+q);
  }

}
