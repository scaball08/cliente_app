import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = "Por favor Sign In";
  usuario:Usuario;
  flagLogin:boolean = false;


  constructor(private authService:AuthService, private router:Router ) {
    this.usuario =  new Usuario();
  }

  ngOnInit() {

    // se verifica que el usuario se haya autenticado
    if(this.authService.isAuthenticated()){
      Swal.fire({
        title:"Login",
        text:`Hola ${this.authService.usuario.username} ya estas autenticado!`,
        type:'info'
      });
      this.router.navigate(['/clientes']);

    }

  }

  login():void{
    console.log(this.usuario);

    if (this.usuario.username== null || this.usuario.password == null) {
      Swal.fire({
        title : 'Error Login',
        text : 'Nombre de usuario o Password vacios',
        type : 'error'}
      );
    return;
    }

    this.authService.login(this.usuario).subscribe(response=>{
      console.log(response.access_token);


      //guardar usuario
      this.authService.guardarUsuario(response.access_token);
      //guardar token en el sessionStorage
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;
      this.flagLogin =false;
      this.router.navigate(['/clientes']);
      Swal.fire({
        title:'login',
        text:`Hola ${usuario.username} has iniciado secion con exito!`,
        type:'success'

      });

    },
    // verificar cuando hay error de credenciales  password o usuario
    err =>{
      if(err.status == 400){
        this.flagLogin =true;
        Swal.fire({
        title:'Error Login',
        text:'Usuario o clave incorrectos',
        type:'error'

      });

      }
    }
    );



  }

}
