import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userData: any = {};

  constructor(private userService:UserService, public authService:AuthService, private router:Router, private _alert: AlertsService) { }

  ngOnInit() {
    this.userService.getProfile().subscribe((data: any) => {
      this.userData = data.data;
      if(this.userData.dateOfBirth) {
        this.userData.dateOfBirth = this.userData.dateOfBirth.substring(0,10);
      }
    }, error => {
      this._alert.create('error', 'There was some error in fetching profile details');
    });
  }

  updateProfile(): void {
    if(this.userData.firstName.length === 0){
      this._alert.create('warning', 'First name is required');
      return;
    }
    if(this.userData.lastName.length === 0){
      this._alert.create('warning', 'Last name is required');
      return;
    }
    if(this.userData.phoneNumber === null){
      this._alert.create('warning', 'Phone number is required');
      return;
    }
    if(this.userData.phoneNumber.length !== 10){
      this._alert.create('warning', 'Phone number is invalid');
      return;
    }
    if(this.userData.ssn === null){
      this._alert.create('warning', 'SSN is required');
      return;
    }
    if(this.userData.ssn.length !== 9){
      this._alert.create('warning', 'SSN is invalid');
      return;
    }
    this.userService.updateProfile(this.userData).subscribe((data: any) => {
      this._alert.create('success', 'Successfully updated the profile details');
      this.router.navigate(['profile']);
    }, error => {
      this._alert.create('error', 'There was some error in updating the profile details');
    });
  }

  onFileUpload(e: any): void {
    this.userData.photoFile = e.target.files[0];
  }

}
