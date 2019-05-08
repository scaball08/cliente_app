import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient,HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { Region } from './detalle/region';


@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeader = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient,private router:Router) { }


    getRegiones(): Observable<Region[]>{

      return this.http.get<Region[]>(this.urlEndPoint + "/regiones");
    }
    getClientes(page:number): Observable<any> {

      return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
        // el operador tap no altera el flujo de datos ni hacer cambio en las variables
        tap((response:any)=>{

          console.log("ClienteService: tap 1");
          (response.content as Cliente[]).forEach(cliente=>{
            console.log(cliente.nombre)
          });
        }),
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

        }),tap((clientes:any)=>{

          console.log("ClienteService: tap 2");
          (clientes.content as Cliente[]).forEach(cliente=>{
            console.log(cliente.nombre);
          });
        })
      );
      //otra forma tambien seria:
      // return this.http.get<Cliente[]>(this.urlEndPoint);
    }

    create(cliente:Cliente):Observable<Cliente>{

      return this.http.post<Cliente>(this.urlEndPoint,cliente,{headers:this.httpHeader}).pipe(

        catchError(e=>{


          //  se valida si hay errores de validacion previamente ya que en la respuesta de error
          //  que se coloco en el backend tiene a propieda error y errors ver metodo en el CONTROLADOR
          if (e.status==400) {
            return throwError(e);
          }

        console.error(e.error.mensaje);
        Swal.fire({
          title: e.error.mensaje,
          text: e.error.error,
          type: 'error'
        });

        return throwError(e);
        })

      );
    }

    update(cliente:Cliente):Observable<Cliente>{
      return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeader}).pipe(

        catchError(e=>{

          //  se valida si hay errores de validacion previamente ya que en la respuesta de error
          //  que se coloco en el backend tiene a propieda error y errors ver metodo en el CONTROLADOR
          if (e.status==400) {
            return throwError(e);
          }

        console.error(e.error.mensaje);
        Swal.fire({
          title: e.error.mensaje,
          text: e.error.error,
          type: 'error'
        });

        return throwError(e);
        })

      );
    }


    getCliente(id):Observable<Cliente>{

      return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(

        catchError(e=>{
          this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire({
          title: 'Error al Editar',
          text: e.error.mensaje,
          type: 'error'
        });

        return throwError(e);
        })

      );
    }

    delete(id:number):Observable<Cliente>{

      return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeader}).pipe(

        catchError(e=>{
          this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire({
          title: e.error.mensaje,
          text: e.error.error,
          type: 'error'
        });

        return throwError(e);
        })

      );
    }


    // retornara un objeto event
     subirFoto(archivo:File,id):Observable<HttpEvent<{}>>{
       // se debe crear un bojeto del tipo FormData
       let formData =  new FormData();

       //se agregan los parametros al objeto formData

       formData.append("archivo",archivo);
       formData.append("id",id);

       const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData, {
        reportProgress: true
      });

       return this.http.request(req);

     }


}
