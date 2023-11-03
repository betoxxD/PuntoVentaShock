import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { Producto } from "src/app/productos/models/producto.interface";
import { ProductosService } from "src/app/productos/services/productos.service";

@Component({
  selector: "app-buscador",
  templateUrl: "./buscador.component.html",
  styleUrls: ["./buscador.component.css"],
})
export class BuscadorComponent implements OnInit {
  productos: Producto[] = [];
  productosCodigo: Producto[] = [];
  productosMarca: Producto[] = [];
  productoEdit?: Producto;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  displayedColumns = ["descripcion", "precio", "codigo", "marca"];
  dataSource = new MatTableDataSource(this.productos);

  constructor(
    private dialogRef: MatDialogRef<BuscadorComponent>,
    private productosService: ProductosService,
    public toast: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProductos();
  }

  // Obtiene los productos de la base de datos
  getProductos(): void {
    this.productosService.get().subscribe(
      (productos: any) => {
        this.productos = productos.lista;
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
        this.dataSource.filterPredicate = (
          data: Producto,
          filter: string
        ): boolean => {
          return data.codigo
            .toLowerCase()
            .startsWith(filter.trim().toLowerCase());
        };
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
  }

  // Muestra un texto recibido en un toast
  showToast(text: string): void {
    this.toast.open(text, "", {
      duration: 2000,
      panelClass: ["snackbar-color"],
    });
  }

  filterOnEnter(value: string): void {
    let results: Producto[] = this.productos.filter((producto: Producto) => {
      return producto.codigo
        .toLowerCase()
        .startsWith(value.trim().toLowerCase());
    });

    console.log(results);

    if (results.length === 1) {
      this.closeWithValue(results[0]);
    } else {
      this.showToast("Debe de haber solamente un elemento en la tabla.");
    }
  }

  // Retorna el elemento seleccionado y cierra el modal
  closeWithValue(producto: Producto): void {
    this.dialogRef.close(producto);
  }

  // Cierra el modal sin un producto
  close(): void {
    this.dialogRef.close();
  }
}
