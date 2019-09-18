import { MatSnackBar } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { PasswordValidation } from './match';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  cliente: Cliente;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;

  form: FormGroup;
  maxFecha: Date;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService, private matSnackBar: MatSnackBar, private sanitization: DomSanitizer) {
  }

  ngOnInit() {
    this.maxFecha = new Date();

    this.form = this.fb.group({
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'fechaNac': new Date(),
      usuario: new FormControl(''),
      password: [''],
      confirmPassword: ['']
    }, {
        validator: PasswordValidation.MatchPassword
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

  selectFile(e: any) {
    //console.log(e.target.file);
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  registrar() {

    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    } else {
      this.currentFileUpload = new File([""], "blanco");
    }

    let cliente = new Cliente();
    cliente.nombres = this.form.value['nombres'];
    cliente.apellidos = this.form.value['apellidos'];
    cliente.dni = this.form.value['dni'];
    cliente.fechaNac = moment(this.form.value['fechaNac']).format('YYYY-MM-DDTHH:mm:ss');
    //cliente.fechaNac = this.form.value['fechaNac'];
   
    let usuario = new Usuario();
    usuario.username = this.form.value['usuario'];
    usuario.password = this.form.value['password'];
    usuario.enabled = true;
    usuario.cliente = cliente;
    
    this.usuarioService.registrar(usuario, this.currentFileUpload).subscribe(() => {
      this.matSnackBar.open('Se creó usuario', 'INFO', {
        duration: 2000
      });

      setTimeout(() => {
        this.router.navigate(['login']);
      }, 1500);
    });
  }

}
