import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements  CanActivate{

  constructor(private authService:AuthService,private router:Router){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // Antes de verificar el rol Validamos que se haya autenticado
    //  y si no esta autenticado retornamos false y  redirigimos al login
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return false;
    }

    // colocamos el valor que recibimos del parametro 'route.data['nombre_parametro']'
    // y lo convertimos a string
    // NOTA: PARA ENVIAR PARAMETROS AL GUARD EN LA RUTA :
    //canActivate:[AuthGuard , RoleGuard], data:{role:'ROLE_ADMIN'}
    let role = route.data['role'] as string;

    // con el metodo hasRole(role) validamos si 'role' es un rol permitido y existe
    if(this.authService.hasRole(role)){
      return true;
    }

    Swal.fire({
      title:'Acceso Denegado',
      text:`Hola ${this.authService.usuario.username} no tiene acceso a este recurso!`,
      type:'warning'
    });

    this.router.navigate(['/clientes']);
    return false;

  }

}
