import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  private host: String = environment.apiHost;

  constructor(private http: HttpClient) { }

  searchFarmers(q: string): any {
    return this.http.get(this.host+'/farmers?q='+q);
  }

  getProfile(): any {
    return this.http.get(this.host+'/profile');
  }

  updateProfile(payload: any): any {
    var formData = new FormData();
    formData.append("firstName", payload.firstName);
    formData.append("lastName", payload.lastName);
    formData.append("streetAddress", payload.streetAddress);
    formData.append("city", payload.city);
    formData.append("state", payload.state);
    formData.append("zipCode", payload.zipCode);
    formData.append("phoneNumber", payload.phoneNumber);
    formData.append("ssn", payload.ssn);
    formData.append("occupation", payload.occupation);
    formData.append("education", payload.education);
    formData.append("pastExperience", payload.pastExperience);
    formData.append("dateOfBirth", payload.dateOfBirth);
    formData.append("file",  payload.photoFile);
    return this.http.put(this.host+'/profile', formData);
  }

}
