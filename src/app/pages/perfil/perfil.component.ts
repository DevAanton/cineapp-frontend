import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ClienteService } from 'src/app/_service/cliente.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuarioR: string;
  roles : String[];
  idClienteOB: number;
  imagenData: any;
  imagenEstado: boolean = false;

  constructor(private clienteService: ClienteService,private sanitization: DomSanitizer) { 
    
    const helper = new JwtHelperService();
        
        let tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
        const decodedToken = helper.decodeToken(tk.access_token);
        
        this.usuarioR = decodedToken.user_name;
        this.roles = decodedToken.authorities;    
  }

  ngOnInit() {
    this.clienteService.listarUsuxNomUsuario(this.usuarioR).subscribe(data => {
      this.idClienteOB = +data.idUsuario;
      console.log(data.idUsuario);
      if (data.idUsuario > 0) {
        this.clienteService.listarPorId(data.idUsuario).subscribe(data => {
          if (data.size > 0) {
            this.convertir(data);
          }
        });
      }
    });
  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      this.imagenData = base64;
      this.setear(base64);
    }
  }

  setear(base64: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(base64);
    this.imagenEstado = true;
  }




}
