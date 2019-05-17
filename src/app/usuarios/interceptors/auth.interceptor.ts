import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

 //Interceptor para manejar el response osea la respuesta
  constructor(private authService:AuthService,private router:Router){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {



    return next.handle(req).pipe(
      catchError(e=>{


    // if que verifica si se ha logueado con el codigo 401 Unauthorizet
    if(e.status== 401 ){

      // En caso de que el oken expire y status sea 401 validamos que estemos logueados y luego no desloguamos
      if(this.authService.isAuthenticated()){

        this.authService.logout();
      }
       this.router.navigate(['/login']);

    }

    // para indicar que no tiene el rol adecuando para el recurso acceso prohibido o forbithen
    if(e.status == 403){
      Swal.fire({
        title:'Acceso Denegado',
        text:`Hola ${this.authService.usuario.username} no tiene acceso a este recurso!`,
        type:'warning'
      });

      this.router.navigate(['/clientes']);

   }
    return throwError(e); // el catchError retorna un throwError(e)

      }) // fin del catchError
    ); // fin del pipe
  }
}
