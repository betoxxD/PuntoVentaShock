import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatTable } from "@angular/material/table";
import { Producto } from "src/app/models/prodicto.interface";
import { ProductosService } from "src/app/services/productos/productos.service";
import { FormControl, FormGroup } from "@angular/forms";
import { IngresarCantidadModalComponent } from "./ingresar-cantidad-modal/ingresar-cantidad-modal.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-vendedor",
  templateUrl: "./vendedor.component.html",
  styleUrls: ["./vendedor.component.css"],
})
export class VendedorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;

  editarFlag = false;

  form: FormGroup;

  todosProductos: Producto[] = [];
  productos: Producto[] = [];

  carrito: Producto[] = [];

  total: number = 0;

  displayedColumns = [
    "nombre",
    "codigo",
    "marca",
    "precio",
    "cantidad",
    "subtotal",
    "accion",
  ];
  dataSource = new MatTableDataSource(this.carrito);

  constructor(
    private _productoService: ProductosService,
    public dialog: MatDialog
  ) {
    this.form = new FormGroup({
      buscar: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  // Obtiene todos los productos de la base de datos
  obtenerProductos() {
    this._productoService.get().subscribe(
      (res: any) => {
        this.productos = res.lista;
        console.log(this.productos);
        this.todosProductos = res.lista;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  // Filtra los productos de acuerdo al valor ingresado en el buscador
  filtrarProductosOnInput(event: any) {
    let valor = event.target.value;
    valor = valor.trim();
    if (!!valor && valor.length > 0) {
      this.productos = this.todosProductos.filter((producto: Producto) => {
        return producto.nombre.toLowerCase().includes(valor.toLowerCase());
      });
    } else {
      console.log(this.todosProductos);
      this.productos = [];
    }
  }

  // Agrega un producto al carrito
  agregarProductoOnChange() {
    const codigo = this.form.value.buscar;
    console.log(codigo);
    let producto = this.productos.find((producto: Producto) => {
      return producto.codigo === codigo;
    });
    if (!!producto) {
      this.capturarCantidadOnClick(producto);
    } else {
      console.log("Producto no encontrado");
    }
  }

  // Editar producto del carrito
  editarProductoOnClick(producto: Producto) {
    this.editarFlag = true;
    this.capturarCantidadOnClick(producto);
  }

  // Agrega la cantidad del producto al carrito
  async agregarCantidad(producto: Producto) {
    if(!this.editarFlag) {
      let existe: boolean = false;
      this.carrito.forEach((element) => {
        if (element.codigo === producto.codigo) {
          console.log("Existe");
          element.cantidad! += producto.cantidad!;
          this.dataSource = new MatTableDataSource(this.carrito);
          this.table.renderRows();
          this.form.reset();
          existe = true;
        }
      });
      if (!existe) {
        console.log("No existe");
        this.carrito.push({ ...producto });
        this.dataSource = new MatTableDataSource(this.carrito);
        this.table.renderRows();
        this.form.reset();
      }
    } else {
      this.carrito.forEach((productoCarrito) => {
        if(producto.id === productoCarrito.id) {
          productoCarrito.cantidad = producto.cantidad;
        }
      });
    }
    this.calcularTotal();
    this.editarFlag = false;
    this.productos = [];
  }

  // Abre el diálogo para capturar la cantidad del producto
  capturarCantidadOnClick(producto: Producto): void {
    const dialogRef = this.dialog.open(IngresarCantidadModalComponent, {
      width: "500px",
      data: { producto: { ...producto } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (!!result) {
        producto.cantidad = result;
        this.agregarCantidad({ ...producto });
      }
    });
  }

  // Elimina un producto del carrito
  eliminarProducto(producto: Producto) {
    this.carrito = this.carrito.filter((productoCarrito: Producto) => {
      return productoCarrito.codigo !== producto.codigo;
    });
    this.dataSource = new MatTableDataSource(this.carrito);
    this.table.renderRows();
  }

  // Calcula el total de la venta
  calcularTotal() {
    this.total = 0;
    this.carrito.forEach((producto) => {
      this.total += producto.precio * producto.cantidad!;
    });
  }
}
