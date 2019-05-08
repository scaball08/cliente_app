import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal:boolean=false;

  // se crear la propiedad del tipo EventEmitter<any> para emitir el evento de subir la foto
  // se crea el getter para retornar lapropiedad y siga privada
   private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  // retorna un obcervable del tipo evento que contiene el cliente actualizado con la nueva FOTO
  public get notificarUpload():EventEmitter<any> {
    return this._notificarUpload;
  }
  public set notificarUpload(value) {
    this._notificarUpload = value;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }

}
