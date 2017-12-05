import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  public isLogged: boolean = false;
  public uname: String = '';
  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) {
    this.checkSession().subscribe((data: any) => {
      this.isLogged = true;
      this.uname = data.data.uname;
    }, (error: any) => {
      this.isLogged = false;
    });
  }

  setIsLogged(isLogged: boolean): void {
    this.isLogged = isLogged;
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

  checkSession<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/check_session');
  }

}
