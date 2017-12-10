import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class FarmService {

  private host: String = "http://localhost:3001/api/v1";

  constructor(private http: HttpClient) { }

  addNewFarm<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/farms', JSON.stringify(payload));
  }

  updateFarm<T>(payload: any, id: any): Observable<T> {
    return this.http.put<T>(this.host+'/farms/'+id, JSON.stringify(payload));
  }

  getMyFarms<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/myfarms');
  }

  deleteFarm<T>(id: any): Observable<T> {
    return this.http.delete<T>(this.host+'/farms/'+id);
  }

  addNewAdminFarm<T>(payload: any): Observable<T> {
    return this.http.post<T>(this.host+'/adminfarms', JSON.stringify(payload));
  }

  updateAdminFarm<T>(payload: any, id: any): Observable<T> {
    return this.http.put<T>(this.host+'/adminfarms/'+id, JSON.stringify(payload));
  }

  getAdminFarms<T>(): Observable<T> {
    return this.http.get<T>(this.host+'/adminfarms');
  }

  deleteAdminFarm<T>(id: any): Observable<T> {
    return this.http.delete<T>(this.host+'/adminfarms/'+id);
  }

  searchFarms<T>(lat: number, lng: number): Observable<T> {
    return this.http.get<T>(this.host+'/farms?lat='+lat+'&lng='+lng);
  }

}
