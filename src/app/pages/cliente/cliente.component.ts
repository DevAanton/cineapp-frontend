import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from 'src/app/_service/cliente.service';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';
import { switchMap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Usuario } from 'src/app/_model/usuario';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Cliente>;
  displayedColumns = ['idCliente', 'nombres', 'apellidos','dni','acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clienteService: ClienteService,private usuarioService: UsuarioService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.clienteService.clienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.clienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      })
    });

    this.clienteService.listarPageable(0, 5).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cantidad = data.totalElements;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(cliente?: Cliente) {      
    let clie = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent, {
      width: '450px',
      height: '600px',
      data: clie
    });
  }

  mostrarMas(e : any){    
    this.clienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {

      let generos = data.content;
      this.cantidad = data.totalElements;
      
      this.dataSource = new MatTableDataSource(generos);
      this.dataSource.sort = this.sort;
      });
  }

  eliminar(cliente: Cliente) {
    this.clienteService.eliminar(cliente.idCliente).pipe(switchMap(() => {
      return this.clienteService.listar();
    })).subscribe(data => {
      this.clienteService.clienteCambio.next(data);
      this.clienteService.mensajeCambio.next("Se elimino");
    });
  }

}
