import { Component, OnInit } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { Region } from './detalle/region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
   accion:String = "Crear";
   cliente:Cliente=new Cliente();
   titulo:string = `${this.accion} Cliente`;
   errores:string[];
   regiones:Region[];
  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute:ActivatedRoute) {

   }

  ngOnInit() {
    this.cargarCliente();
  }


  cargarCliente():void{

    this.activatedRoute.params.subscribe(params=>{
     let id = params['id'];
     if (id) {
       this.accion = "Editar";
       this.titulo = `${this.accion} Cliente`;
       this.clienteService.getCliente(id).subscribe((response)=>{
         console.log(response);
         this.cliente=response;

        });

     }

    });

    this.clienteService.getRegiones().subscribe(regiones=> this.regiones = regiones);

  }

  create(forma:NgForm):void{
    // console.log("formulario Posteado");
    // console.log("ngForm: ",forma);
    // console.log("Valor: ",forma.value);
    // console.log(this.cliente);

    this.clienteService.create(this.cliente).
    subscribe((cliente:{})=> {
      this.router.navigate(['/clientes']);
      Swal.fire({
        title: 'Nuevo Cliente',
        text: ` Cliente ${cliente['cliente'].nombre} se ha creado con exito!`,
        type: 'success',
        confirmButtonText: 'Ok'
      });

    }, err=> {
      this.errores = err.error.errors as string[];

      console.error("Codigo de error desde el backend: " + err.status);
      console.error(err.error.errors);

    }

    );
  }

  update(forma:NgForm):void{

    console.log("formulario Posteado");
    console.log("ngForm: ",forma);
    console.log("Valor: ",forma.value);
    console.log(this.cliente);

    this.clienteService.update(this.cliente)
    .subscribe((cliente:{})=>{

      this.router.navigate(['/clientes']);
      console.log(cliente);
      Swal.fire({
        title: 'Actualizacion de Cliente',
        text: ` Cliente ${cliente['cliente'].nombre} se ha Actualizado con exito!`,
        type: 'success',
        confirmButtonText: 'Ok'
      });
      }, err=> {
      this.errores = err.error.errors as string[];

      console.error("Codigo de error desde el backend: " + err.status);
      console.error(err.error.errors);

      }
     );
  }

  compararRegion(obj1:Region,obj2:Region):boolean{
    if(obj1 === undefined && obj2 === undefined ){
     return true;
    }
    return obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined ? false : obj1.id===obj2.id;
  }

}
