import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
//import { AuthService } from './auth.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req.withCredentials = true;
    req = req.clone({ headers: req.headers.set('credentials', 'include') });
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req).catch((error, caught) => {
      if (error.status === 403) {
        //logout users, redirect to login page
        //authService.removeTokens();
        //redirect to the signin page or show login modal here
        //this.authService.setIsLogged(false);
        this.router.navigate(['/landing']);
        return Observable.throw(error);
      } else {
        return Observable.throw(error);
      }
    }) as any;;
  }
}
