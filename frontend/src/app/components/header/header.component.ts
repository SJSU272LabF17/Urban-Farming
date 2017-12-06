import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService:AuthService, private sharedService:SharedService) { }

  ngOnInit() {
  }

  logout() : void {
    this.authService.logout().subscribe((data: any) => {
      this.authService.resetValues();
      this.router.navigate(['/']);
    }, error => {
      this.authService.resetValues();
      this.router.navigate(['/']);
    });
  }

}
