import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../modal/modal.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private modalService:ModalService, private authService:AuthService) { }

  ngOnInit() {
  }

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
      password: ''
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
        password: ''
      }
    }
  }

  signin() : void {
    this.authService.signin(this.signinData).subscribe((data: any) => {
      this.authService.setIsLogged(true);
      this.closeAuthModal();
    }, error => {
      console.log(error);
    }, () => {
      console.log("complete");
    });
  }

  signup() : void {
    this.authService.signup(this.signupData).subscribe((data: any) => {
      this.authService.setIsLogged(true);
      this.closeAuthModal();
    }, error => {
      console.log(error);
    });
  }

  logout() : void {
    this.authService.logout().subscribe((data: any) => {
      this.authService.setIsLogged(false);
      this.router.navigate(['/landing']);
    }, error => {
      this.authService.setIsLogged(false);
      this.router.navigate(['/landing']);
    });
  }

}
