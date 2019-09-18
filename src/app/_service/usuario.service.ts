import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Usuario } from '../_model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string = `${environment.HOST}/usuarios`;
  //url: string = `${environment.HOST}/${environment.MICRO_CR}/usuarios`;
  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario, file?: File) {

    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    
    formdata.append('usuario', clienteBlob);

    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });

    //return this.http.post(this.url, usuario);
  }
  modificar(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    
    formdata.append('usuario', clienteBlob);

    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });
  }

}
