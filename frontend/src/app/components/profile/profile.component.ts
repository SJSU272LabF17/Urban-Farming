import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any = {};

  constructor(private userService:UserService, public authService:AuthService, public router:Router, private _alert:AlertsService) { }

  ngOnInit() {
    this.userService.getProfile().subscribe((data: any) => {
      this.userData = data.data;
      if(this.userData.dateOfBirth) {
        var temp = this.userData.dateOfBirth.substring(0,10).split("-")
        this.userData.dateOfBirth = temp[1]+"/"+temp[2]+"/"+temp[0];
      }
    }, error => {
      this._alert.create('error', 'There was some error in fetching profile details');
    });
  }

}
