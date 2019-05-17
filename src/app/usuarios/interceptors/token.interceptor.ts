import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

 //POR default  el interceptor agrega  : private httpHeader = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private authService:AuthService){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      let token = this.authService.token;

    if(token !=null){

      // se cola una nueva instacia del request 'req' y se le asignamos a la onstante authReq
      const authReq = req.clone({
        headers:req.headers.set('Authorization' , 'Bearer ' + token)
      });
      return next.handle(authReq); // metodo que hace es ir al proximo interceptor hasta llegar al ultimo
    }
    return next.handle(req);
  }
}
