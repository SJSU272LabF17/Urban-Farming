import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isSigninForm: boolean = true;
  signinData: Object = {
    email: '',
    password: ''
  };
  signupData: Object = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  constructor(private modalService:ModalService) { }

  ngOnInit() {
  }

  openAuthModal() : void {
    this.isSigninForm = true;
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
        password: ''
      }
    }
  }

  signin() : void {

  }

  signup() : void {

  }

}
