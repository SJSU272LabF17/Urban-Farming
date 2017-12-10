import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any = {};

  constructor(private userService:UserService, private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.userService.getProfile().subscribe((data: any) => {
      this.userData = data.data;
      if(this.userData.dateOfBirth) {
        var temp = this.userData.dateOfBirth.substring(0,10).split("-")
        this.userData.dateOfBirth = temp[1]+"/"+temp[2]+"/"+temp[0];
      }
    }, error => {
      console.log(error);
    });
  }

}
