import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente:Cliente;
  titulo:string = "Detalle del Cliente";
   fotoSeleccionada:File;
    progreso:number = 0;

  constructor(private clienteService:ClienteService,  public modalService:ModalService) {

  }

  ngOnInit() {
  }


  seleccionarFoto(event){

    // el evento que enviamos desde la vista contiene el archivo (foto) que
    // vamo a subir , se lo asignamos a la variable fotoSeleccionada:File
    // con event.target.files[0] como solo tenemos unos colocamos '0' en el indice del arreglo
    this.fotoSeleccionada =  event.target.files[0];
    console.log(this.fotoSeleccionada);
    this.progreso = 0;
    // busca en el string del atributo type la concurrencia(image)  si es -1 quiere decir
    // que no es una imagen no encontro concurrencia
    if(this.fotoSeleccionada.type.indexOf('image') < 0 ){

      Swal.fire(
        'Error al seleccionar imagen',
        "el tipo de archivo no es una imagen",
        'error'
      );
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if (!this.fotoSeleccionada) {

      Swal.fire(
        'Error Upload',
        "Debe Selecionar una foto",
        'error'
      );

    } else {

      // llamamos al metodo del servicio (subirFoto) y le pasamos el archivo(this.fotoSeleccionada)
    // y el id(this.cliente.id)
    this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id)
           .subscribe(event=>{

                if(event.type === HttpEventType.UploadProgress){

                  // se calcula el porcentaje de lo cargado cn el objeto evento
                  this.progreso = Math.round((event.loaded/event.total)*100);
                } else if(event.type===HttpEventType.Response){

                  let response:any = event.body;

                  this.cliente = response.cliente as Cliente;

                  // se emite el evento  con el cliente
                  this.modalService.notificarUpload.emit(this.cliente);

                  Swal.fire(
                    'La imgen se subio correctamente!',
                    response.mensaje,
                    'success'
                  );

                }// else 2 if

              });// subscribe

    } // else 1

  }// fin subir foto


  cerrarModal(){

    this.modalService.cerrarModal();
    this.progreso = 0;
    this.fotoSeleccionada = null;
  }

}
