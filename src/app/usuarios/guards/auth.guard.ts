import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/*Clase  Guard para restringir el acceso a las rutan permitidas solo a los usuario
con ciertos roles en la aplicacion Angular*/
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{

  constructor(private authService:AuthService, private router:Router){

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   if(this.authService.isAuthenticated()){

    // Se valida previamente si el token ha expirado
     if(this.isTokenExpirado()){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;

     }

     return true;
   }

   this.router.navigate(['/login']);
   return false;

  }


  // metodo para validar si el token ha expirado
  isTokenExpirado():boolean{
    let token = this.authService.token;
    let payload =  this.authService.obtenerDatosToken(token);

    // fecha actual en  milisegundo y se convierte en segundos
    let now = new Date().getTime()/1000;
    console.log(now);
    console.log(payload.exp);

    // validamos si la fecha actual es mayo a la fecha de expiracion en el token
    if(payload.exp<now){

      return true;
    }
    return false;
  }

}
