import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;

  private _token: string;

  constructor(private http:HttpClient) { }

  public get usuario(): Usuario {
      if (this._usuario != null ) {
        return this._usuario;
      } else if(this._usuario==null  && sessionStorage.getItem('usuario') !=null)
      {
        // si el usuario es nulo pero esta guardado en el sessionStorage
        // se le asigna los datos del usuario al atributo _usuario
        // como en el sessionStorage es un strin lo parseamos a un bjeto json
        this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;

        return this._usuario;
      }

      // si no existe en nigun lado se retorna una instacia de Usuario
      return new Usuario();
  }

  public get token(): string {

    if (this._token != null ) {
      return this._token;
    } else if(this._usuario==null  && sessionStorage.getItem('token')!=null)
    {

      this._token = sessionStorage.getItem('token');

      return this._token;
    }

    // si no existe en nigun lado se retorna una instacia de Usuario
    return this._token;


  }

  login(usuario:Usuario):Observable<any>{

    const urlEndPoint = 'http://localhost:8080/oauth/token';

    // constante  que recibe las credenciales mediante una cadena encriptada en base64
    //utilizando el metodo btoa('angularapp' + ':' + '12345');
    const credenciales = btoa('angularapp' + ':' + '12345');

    // objeto de tipo HttpHeaders({}) que recibe una cadena o un objeto con los atributos del header
    // para enviar credenciales  se envia {'Content-Type' : 'application/x-www-form-urlencoded','Authorization' : 'Basic' + credenciales}
    const htttHeaders = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded',
     'Authorization' : 'Basic ' + credenciales
     });

     // objeto  de tipo new URLSearchParams() al que se le pueden agregar los parametros del body
     // del url mediate el metodo set('atributo','valor')
     let params =  new URLSearchParams();

     params.set('grant_type','password');
     params.set('username',usuario.username);
     params.set('password',usuario.password);

     // IMPORTANTE: el params de tipo URLSearchParams() se tiene que convertir a string con .toString()
     // de lo contrario mandara error
     console.log(params.toString());
    return this.http.post<any>(urlEndPoint,params.toString(),{headers:htttHeaders})
  }

   //guardar usuario
   guardarUsuario(accessToken:string):void{
     console.log(this.obtenerDatosToken(accessToken));
    let payload = this.obtenerDatosToken(accessToken);
    console.log(payload);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    // guardamos el usuario en el sessionStorage  convirtiendo el objeto a un String en formato json
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));

   }

   //guardar token en el sessionStorage
   guardarToken(accessToken:string):void{

    this._token = accessToken;

    sessionStorage.setItem('token',accessToken);

   }

   //metodo para obtener la carga util del token encriptado y lo retorna
   obtenerDatosToken(accessToken:string):any{

    // console.log(accessToken);
    // console.log(JSON.parse(atob(accessToken.split(".")[1])));
        //se verifica que el accessToken   no sea nulo se retrona el el peyload en objeto json
        if(accessToken !=null){

      // Obetener el dato del usuario mediate el toke :
      //1. obtenemos el token de la respuesta con 'response.access_token'
      //2. cada parte del token esta separada por punto asique los transformamos
      //en un arrays de string con response.access_token.split(".") entre corchetes  como solo queremos
      //la carga util le indicamos que del array queremos la posicion '1' response.access_token.split(".")[1]
      //3. se descencripta el token que esta en base64 con el metodo atob(response.access_token.split(".")[1])
      // por ultimo lo convertimos a 'JSON'con JSON.parse(atob(response.access_token.split(".")[1]))

          return JSON.parse(atob(accessToken.split(".")[1]));

        }
        return null;


   }


    //Verifica que el usuario este autenticado
    isAuthenticated():boolean{
      let payload =  this.obtenerDatosToken(this.token)

      if(payload!=null && payload.user_name && payload.user_name.length>0){
      return true;
      }

      return false;
    }


    //Metodo para verificar los roles de una usuario y mostramos solo los componentes
    // que permitidos para ese role
    hasRole(role:string):boolean{
      // valida si el role que le enviamos esta dentro del arreglo en el atributo usuario
      //this.usuario.roles.includes(role)
      if(this.usuario.roles.includes(role)){
         return true;
      }

      return false;
    }

    logout():void{
      // para desloguearse se debe hacer lo siguiente:

      // colocar las variable locales _toke y _usuarioen null
      this._token = null;
      this._usuario = null;

      // eliminar el token y el usuario del sessionStorage
      // metodo 1  elimina todas las viables del sessionStorage
      sessionStorage.clear();
      //metodo2 uno a uno por el nombre con el que se guardo
      //sessionStorage.removeItem('nombre_variable');

    }

}
