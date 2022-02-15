import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatTable } from "@angular/material/table";
import { Producto } from "src/app/models/producto.interface";
import { ProductosService } from "src/app/services/productos/productos.service";
import { FormControl, FormGroup } from "@angular/forms";
import { IngresarCantidadModalComponent } from "./ingresar-cantidad-modal/ingresar-cantidad-modal.component";
import { MatDialog } from "@angular/material/dialog";
import * as printJS from "print-js";
import { TicketComponent } from "./ticket/ticket.component";
import { CambioModalComponent } from "./cambio-modal/cambio-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatInput } from "@angular/material/input";
import { ConfirmCancelModalComponent } from "./confirm-cancel-modal/confirm-cancel-modal.component";

@Component({
  selector: "app-vendedor",
  templateUrl: "./vendedor.component.html",
  styleUrls: ["./vendedor.component.css"],
})
export class VendedorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatInput) buscar!: HTMLInputElement;

  // @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === "F2") {
      this.imprimirCarritoOnClick();
    }
  }

  editarFlag = false;

  form: FormGroup;

  todosProductos: Producto[] = [];
  productos: Producto[] = [];

  carrito: Producto[] = [];

  total: number = 0;
  cantPrendas: number = 0;

  displayedColumns = [
    "codigo",
    "marca",
    "descripcion",
    "precio",
    "cantidad",
    "subtotal",
    "accion",
  ];
  dataSource = new MatTableDataSource(this.carrito);

  constructor(
    private _productoService: ProductosService,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar
  ) {
    this.form = new FormGroup({
      buscar: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.buscar.focus();
  }

  // Obtiene todos los productos de la base de datos
  obtenerProductos() {
    this._productoService.get().subscribe(
      (res: any) => {
        // this.productos = res.lista;
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
        return producto.codigo.toLowerCase().includes(valor.toLowerCase());
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
    if (!this.editarFlag) {
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
        if (producto.id === productoCarrito.id) {
          productoCarrito.cantidad = producto.cantidad;
        }
      });
    }
    this.calcularTotal();
    this.contarCantidad();
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

  // Abre el modal para calcular el cambio
  calcularCambio(): void {
    const dialogRef = this.dialog.open(CambioModalComponent, {
      width: "500px",
      data: { total: this.total },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (!!result) {
        this.limpiarCarrito();
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
    this.calcularTotal();
    this.contarCantidad();
  }

  // Calcula el total de la venta
  calcularTotal() {
    this.total = 0;
    this.carrito.forEach((producto) => {
      this.total += producto.precio * producto.cantidad!;
    });
  }

  // Cuenta el número de productos en el carrito
  contarCantidad() {
    this.cantPrendas = 0;
    this.carrito.forEach((producto) => {
      this.cantPrendas += producto.cantidad!;
    });
  }

  // Imprime el carrito
  imprimirCarritoOnClick() {
    if (this.carrito.length > 0) {
      const dialogRef = this.dialog.open(TicketComponent, {
        width: "500px",
        data: { carrito: [...this.carrito] },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(!!result) {
          this.calcularCambio();
        }
        console.log("The dialog was closed");
      });
    } else {
      this._snackbar.open("No hay productos en el carrito", "", {
        duration: 2000,
      });
    }
  }

  // Solicita la confirmación para la cancelación del producto
  cancelarProductoModal() {
    const dialogRef = this.dialog.open(ConfirmCancelModalComponent, {
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.limpiarCarrito();
      }
    });
  }

  // Limpia la información para una nueva venta
  limpiarCarrito() {
    this.carrito = [];
    this.dataSource = new MatTableDataSource(this.carrito);
    this.table.renderRows();
    this.total = 0;
    this.cantPrendas = 0;
  }
}
