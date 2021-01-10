import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = req;
    let token = this.auth.getToken();
    if (token) {
      let newHeaders = {
        headers: req.headers.set('token', token)
      }
      newRequest = req.clone(newHeaders);
    }
    return next.handle(newRequest);
  }

}