import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { Region } from './detalle/region';


@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient,private router:Router) { }


  // //metodo para agregar la intacia de tipo HttpHeaders con el atributo 'Authorization'
  // // y se agrega el token de aceso 'Bearer ' + token  a cada enpoint protegido
  //   private agregarAuthorizationHeader():HttpHeaders {
  //   let token = this.authService.token;

  //   if(token !==null){
  //     return this.httpHeader.append('Authorization' , 'Bearer ' + token);
  //   }

  //   return this.httpHeader;
  //   }


    // MEtodo para validar el codigo del error del hhtpRequest
    // si hay error  envia retorna true y sino retorna false
  //  private isNoAutorizado(e):boolean{

  //   // if que verifica si se ha logueado con el codigo 401 Unauthorizet
  //   if(e.status== 401 ){

  //     // En caso de que el oken expire y status sea 401 validamos que estemos logueados y luego no desloguamos
  //     if(this.authService.isAuthenticated()){

  //       this.authService.logout();
  //     }
  //      this.router.navigate(['/login']);
  //     return true;
  //   }

  //   // para indicar que no tiene el rol adecuando para el recurso acceso prohibido o forbithen
  //   if(e.status == 403){
  //     Swal.fire({
  //       title:'Acceso Denegado',
  //       text:`Hola ${this.authService.usuario.username} no tiene acceso a este recurso!`,
  //       type:'warning'
  //     });

  //     this.router.navigate(['/clientes']);
  //    return true;
  //  }
  //   return false;
  //  }


    getRegiones(): Observable<Region[]>{

      return this.http.get<Region[]>(this.urlEndPoint + "/regiones");
    }


    getClientes(page:number): Observable<any> {

      return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
        // el operador tap no altera el flujo de datos ni hacer cambio en las variables

        map((response:any) => {

        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          // FORMAS DE FORMATEAR AL FECHA
          // forma 1
          let datepipe =  new DatePipe('es');
          //cliente.createAt = datepipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
          //forma 2
          // cliente.createAt = formatDate(cliente.createAt,'dd-mm-yyyy','en-US');
          return cliente
        });
        return response;

        })
      );
      //otra forma tambien seria:
      // return this.http.get<Cliente[]>(this.urlEndPoint);
    }

    create(cliente:Cliente):Observable<Cliente>{

      return this.http.post<Cliente>(this.urlEndPoint,cliente).pipe(

        catchError(e=>{



          //  se valida si hay errores de validacion previamente ya que en la respuesta de error
          //  que se coloco en el backend tiene a propieda error y errors ver metodo en el CONTROLADOR
          if (e.status==400) {
            return throwError(e);
          }

          // validamos si el backend envio un mensaje de error y los mostramos en consola
          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }

        return throwError(e);
        })

      );
    }

    update(cliente:Cliente):Observable<Cliente>{
      return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(

        catchError(e=>{



          //  se valida si hay errores de validacion previamente ya que en la respuesta de error
          //  que se coloco en el backend tiene a propieda error y errors ver metodo en el CONTROLADOR
          if (e.status==400) {
            return throwError(e);
          }

         // validamos si el backend envio un mensaje de error y los mostramos en consola
         if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
        })

      );
    }


    getCliente(id):Observable<Cliente>{

      return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(

        catchError(e=>{

          // validacion para redirigir a clientes cuando el status es distinto a 401
          if(e.status!= 401 && e.error.mensaje){
            this.router.navigate(['/clientes']);
            console.error(e.error.mensaje);
          }


        return throwError(e);
        })

      );
    }

    delete(id:number):Observable<Cliente>{

      return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(

        catchError(e=>{

         // validamos si el backend envio un mensaje de error y los mostramos en consola
         if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
        })

      );
    }


    // retornara un objeto event para que el cambio de la imagen sea detectado en los demas compoenentes
     subirFoto(archivo:File,id):Observable<HttpEvent<{}>>{
       // se debe crear un bojeto del tipo FormData
       let formData =  new FormData();

       //se agregan los parametros al objeto formData INI
       formData.append("archivo",archivo);
       formData.append("id",id);
       // FIN



        // se crea una variable con las configuraciones previas (url,formData,headers)
       const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData, {
        reportProgress: true
      });

       return this.http.request(req);

     }


}
