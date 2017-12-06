import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public isLogged: boolean = true;
  public role: String = "";
  public uname: String = "";
  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  resetValues(): void {
    this.isLogged = false;
    this.uname = "";
    this.role = "";
  }

  signin<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/signin', JSON.stringify(payload));
  }

  signup<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/signup', JSON.stringify(payload));
  }

  logout<T>(): Observable<T> {
    return this.http.post<T>(this.host+'/logout', null);
  }

  checkSession(): Promise<any> {
    return this.http
      .get(this.host+'/check_session')
      .map((res: Response) => res)
      .toPromise()
      .then((data: any) => {
        this.isLogged = true;
        this.uname = data.data.uname;
        this.role = data.data.role;
      })
      .catch((err: any) => {
        this.isLogged = false;
        this.uname = "";
        this.role = "";
        Promise.resolve();
      });
  }

}
