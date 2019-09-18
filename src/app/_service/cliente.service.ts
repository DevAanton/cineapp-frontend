import { Cliente } from './../_model/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Usuario } from '../_model/usuario';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  clienteCambio = new Subject<Cliente[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/clientes`;
  //url: string = `${environment.HOST}/${environment.MICRO_CRUD}/clientes`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Cliente[]>(this.url);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  listarPorId(id: number) {
    return this.http.get(`${this.url}/${id}`, {
      responseType: 'blob'
    });
  }

  registrar(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const comidaBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    formdata.append('usuario', comidaBlob);

    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  modificar(cliente: Cliente, file?: File) {

    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const comidaBlob = new Blob([JSON.stringify(cliente)], { type: "application/json" });
    formdata.append('cliente', comidaBlob);

    return this.http.put(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listarUsuxNomUsuario(param: string) {
    return this.http.get<Usuario>(`${this.url}/buscarusu/${param}`);
  }

  listarUsuxNomCliente(param: string) {
    return this.http.get<Usuario>(`${this.url}/getusuario/${param}`);
  }

}
