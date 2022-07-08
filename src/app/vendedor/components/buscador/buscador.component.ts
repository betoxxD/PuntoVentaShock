import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Producto} from 'src/app/productos/models/producto.interface';
import {ProductosService} from 'src/app/productos/services/productos.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  formInsertarProducto: FormGroup;

  productos: Producto[] = [];
  productosCodigo: Producto[] = [];
  productosMarca: Producto[] = [];
  productoEdit?: Producto;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns = ["descripcion", "precio", "codigo", "marca", "id"];
  dataSource = new MatTableDataSource(this.productos);


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private dialogRef: MatDialogRef<BuscadorComponent>,
    private productosService: ProductosService,
    public toast: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.formInsertarProducto = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      precio: new FormControl(null, Validators.required),
      codigo: new FormControl(null, [Validators.required]),
      marca: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getProductos();
  }

  // Obtiene los productos de la base de datos
  getProductos(): void {
    this.productosService.get().subscribe(
      (productos: any) => {
        this.productos = productos.lista;
        this.dataSource = new MatTableDataSource(this.productos);
        this.table.renderRows();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // Muestra un texto recibido en un toast
  showToast(text: string): void {
    this.toast.open(text, "", {
      duration: 2000,
      panelClass: ["snackbar-color"],
    });
  }

  // Cierra el modal sin un producto
  close(): void {
    this.dialogRef.close();
  }

}
