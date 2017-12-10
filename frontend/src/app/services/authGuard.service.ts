import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService:AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLogged) {
      // logged in so return true
      if(route.data["role"] && route.data["role"].indexOf(this.authService.role) === -1){
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/']);
    return false;
  }
}
