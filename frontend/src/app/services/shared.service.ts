import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { AuthService } from './auth.service';

@Injectable()
export class SharedService {

  isSigninForm: boolean = true;
  signinData: Object = {
    email: '',
    password: ''
  };
  signupData: Object = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'FARMER'
  };

  constructor(private router: Router, private modalService:ModalService, private authService:AuthService) { }

  openAuthModal() : void {
    this.isSigninForm = true;
    this.signinData = {
      email: '',
      password: ''
    }
    this.signupData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'FARMER'
    }
    this.modalService.open('auth-modal');
  }

  closeAuthModal() : void {
    this.modalService.close('auth-modal');
  }

  toggleAuthForm() : void {
    this.isSigninForm = !this.isSigninForm;
    if(this.isSigninForm){
      this.signinData = {
        email: '',
        password: ''
      }
    } else {
      this.signupData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'FARMER'
      }
    }
  }

  signin() : void {
    //TODO: validation
    this.authService.signin(this.signinData).subscribe((data: any) => {
      this.authService.checkSession();
      this.closeAuthModal();
    }, error => {
      console.log(error);
    }, () => {
      console.log("complete");
    });
  }

  signup() : void {
    //TODO: validation
    this.authService.signup(this.signupData).subscribe((data: any) => {
      this.authService.checkSession();
      this.closeAuthModal();
    }, error => {
      console.log(error);
    });
  }

  openOwnerRegister() : void {
    this.isSigninForm = false;
    this.signinData = {
      email: '',
      password: ''
    }
    this.signupData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'OWNER'
    }
    this.modalService.open('auth-modal');
  }

}
