import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public isLogged: boolean = true;
  public role: String = "";
  public uname: String = "";
  public uid: String = "";
  public photo: String;
  private host: String = environment.apiHost;

  constructor(private http: HttpClient) { }

  resetValues(): void {
    this.isLogged = false;
    this.uname = "";
    this.role = "";
    this.uid = "";
    this.photo = null;
  }

  signin<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/signin', JSON.stringify(payload),{ headers: {'Content-Type' : 'application/json'} });
  }

  signup<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/signup', JSON.stringify(payload),{ headers: {'Content-Type' : 'application/json'} });
  }

  logout<T>(): Observable<T> {
    return this.http.post<T>(this.host+'/logout', null,{ headers: {'Content-Type' : 'application/json'} });
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
        this.uid = data.data.uid;
        this.photo = data.data.photo;
      })
      .catch((err: any) => {
        this.isLogged = false;
        this.uname = "";
        this.role = "";
        this.uid = "";
        this.photo = null;
        Promise.resolve();
      });
  }

}
