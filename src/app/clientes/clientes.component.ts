import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2'
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  public paginador:any;
  clienteSeleccionado:Cliente;

  constructor(private clienteService: ClienteService, private activatedRoute:ActivatedRoute,private modalService:ModalService ) { }

  ngOnInit() {


    //cada ves que carga la pagina enviara el parametro al obcervable y nos subscribimos
    this.activatedRoute.paramMap.subscribe(params =>{
      let page:number =   Number(params.get('page'));
       console.log("Pagina:");

      if(!page){
        page = 0;
      }
      console.log(page);

    this.clienteService.getClientes(page).pipe(
      tap((response:any)=>{

        console.log("ClienteService: tap 3");
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente.nombre);
        });
      })
     )
    .subscribe(
       (response:any) => {
         this.clientes = response.content as Cliente[];
         this.paginador =  response;
         console.log("Total de paginas:");
         console.log(this.paginador.totalPages);
         console.log(this.paginador);
        }
    );

    // como en dettalleComponent  ya emitimos el evento observable con el cliente_fotoNueva
    // se neceita actulizarlo en la lista de cliente , nos subscribimos y luego recoremos
    //lista de cliente con el map
    this.modalService.notificarUpload.subscribe(cliente=>{

      // le asignamos la lista this.clientes mapeada con el cliente y su foto actualizado
      this.clientes = this.clientes.map(clienteActual=>{
        if (clienteActual.id==cliente.id) {
          clienteActual.foto = cliente.foto;
        }
        return clienteActual
      });

    });


  });

  }

  delete(cliente:Cliente):void{

    Swal.fire({
      title: 'Estas seguro ?',
      text: `¿Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?` ,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, no deseo eliminarlo'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(response=>{
          this.clientes = this.clientes.filter(cli=> cli!==cliente)
          Swal.fire(
            'Eliminado!',
            `Cliente ${cliente.nombre} Eliminado con exito!`,
            'success'
          )
        });

      }
    })


  }

  abrirModal(cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
