import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/models/producto.interface';
import { ProductosService } from 'src/app/services/productos/productos.service';
import Swal from 'sweetalert2';
import { ModifyProductModalComponent } from './modify-product-modal/modify-product-modal.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  formInsertarProducto: FormGroup;

  productos: Producto[] = [];
  productoEdit?: Producto;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['descripcion', 'precio', 'codigo', 'marca', 'id'];
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
    private productosService: ProductosService,
    public dialog: MatDialog
  ) {
    this.formInsertarProducto = new FormGroup(
      {
        descripcion: new FormControl(null, Validators.required),
        precio: new FormControl(null, Validators.required),
        codigo: new FormControl(null, Validators.required),
        marca: new FormControl(null, Validators.required),
      }
    );
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

  // Inserta un producto en la base de datos
  insertarProducto(): void {
    if(this.formInsertarProducto.valid) {
      this.productosService.insert({...this.formInsertarProducto.value}).subscribe(
        (producto: any) => {
          this.getProductos();
          this.formInsertarProducto.reset();
          Swal.fire({
            title: 'Producto agregado',
            text: 'El producto se registró correctamente',
            icon: 'success'
          });
        },
        (error) => {
          console.log(error);
          Swal.fire({
            title: 'Ha ocurrido un error',
            text: 'Vuelve a intentarlo más tarde',
            icon: 'error'
          });
        }
      );
    } else {
      console.log('Formulario invalido');
    }
  }

  // Elimina un producto de la base de datos
  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Deseas eliminar este producto?',
      text: 'No podrás recuperarlo después.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this.productosService.delete(id).subscribe(
          (producto: any) => {
            this.getProductos();
            Swal.fire({
              title: 'Producto elminado',
              text: 'El producto se eliminó correctamente',
              icon: 'success'
            });
          },
          (error) => {
            console.log(error);
            Swal.fire(
              {
                title: 'Ocurrió un error',
                text: 'Vuelve a intentarlo más tarde',
                icon: 'error'
            }
            );
          }
        );
      }
    });
  }

  modificarProducto(producto: Producto): void {
    this.productosService.update(this.productoEdit!.id! ,producto).subscribe(
      (res) => {
        this.getProductos();
        this.productoEdit = undefined;
        Swal.fire({
          title: 'Producto modificado',
          text: 'El producto se modificó correctamente',
          icon: 'success'
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Ocurrió un error',
          text: 'Vuelve a intentarlo más tarde',
          icon: 'error'
        });
      }
    );
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // Abre el diálogo para editar un producto
  editarProductoOnClick(producto: Producto): void {
    this.productoEdit = producto;
    const dialogRef = this.dialog.open(ModifyProductModalComponent, {
      width: '500px',
      data: {
        producto: {...this.productoEdit}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(!!result) {
        this.modificarProducto({...result});
      }
    });
  }

}
