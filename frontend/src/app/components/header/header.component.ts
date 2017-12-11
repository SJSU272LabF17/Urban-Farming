import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import {AlertsService} from "@jaspero/ng2-alerts/dist";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public authService:AuthService, public sharedService:SharedService, private _alert:AlertsService) { }

  ngOnInit() {
  }

  logout() : void {
    this.authService.logout().subscribe((data: any) => {
      this._alert.create('success', 'You have successfully logged out');
      this.authService.resetValues();
      this.router.navigate(['/']);
    }, error => {
      this._alert.create('success', 'You have successfully logged out');
      this.authService.resetValues();
      this.router.navigate(['/']);
    });
  }

}
