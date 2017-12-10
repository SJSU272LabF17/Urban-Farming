import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userData: any = {};

  constructor(private userService:UserService, private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.userService.getProfile().subscribe((data: any) => {
      this.userData = data.data;
      if(this.userData.dateOfBirth) {
        this.userData.dateOfBirth = this.userData.dateOfBirth.substring(0,10);
      }
    }, error => {
      console.log(error);
    });
  }

  updateProfile(): void {
    //TODO: validations
    this.userService.updateProfile(this.userData).subscribe((data: any) => {
      this.router.navigate(['profile']);
    }, error => {
      console.log(error);
    });
  }

  onFileUpload(e: any): void {
    this.userData.photoFile = e.target.files[0];
  }

}
