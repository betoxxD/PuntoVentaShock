import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource, MatTable } from "@angular/material/table";
import { ProductosService } from "src/app/productos/services/productos.service";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatInput } from "@angular/material/input";
import { Producto } from "src/app/productos/models/producto.interface";
import { IngresarCantidadModalComponent } from "../../components/ingresar-cantidad-modal/ingresar-cantidad-modal.component";
import { CambioModalComponent } from "../../components/cambio-modal/cambio-modal.component";
import { TicketComponent } from "../../components/ticket/ticket.component";
import { ConfirmCancelModalComponent } from "../../components/confirm-cancel-modal/confirm-cancel-modal.component";
import { AgregarProductoModalComponent } from "../../components/agregar-producto-modal/agregar-producto-modal.component";
import { BuscadorComponent } from "../../components/buscador/buscador.component";

@Component({
  selector: "app-vendedor",
  templateUrl: "./vendedor.component.html",
  styleUrls: ["./vendedor.component.css"],
})
export class VendedorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatInput) buscar!: HTMLInputElement;

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    let functionKeys: string[] = new Array(
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11"
    );
    if (functionKeys.indexOf(event.key) > -1) {
      event.preventDefault();
    }
    if (event.key === "F2") {
      this.buscar.focus();
    }
    if (event.key === "F3") {
      this.imprimirCarritoOnClick();
    }
    if (event.key === "F4") {
      this.agregarProductoNuevoOnClick();
    }
    if (event.key === "F5") {
      this.buscarProducto();
    }
    if (event.key === "F6") {
      this.cancelarProductoModal();
    }
  }

  editarFlag = false;

  form: UntypedFormGroup;

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
    private _snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.form = new UntypedFormGroup({
      buscar: new UntypedFormControl(""),
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.buscar.focus();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  // Obtiene todos los productos de la base de datos
  obtenerProductos() {
    this._productoService.get().subscribe(
      (res: any) => {
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
        return producto.codigo.toLowerCase() === valor.toLowerCase();
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
    let producto = this.productos.find((productoLista: Producto) => {
      return productoLista.codigo === codigo;
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

  // Abre el modal para buscar un producto
  buscarProducto(): void {
    const dialogRef = this.dialog.open(BuscadorComponent, {
      width: "1000px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        this.capturarCantidadOnClick({ ...result });
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
        console.log(result);
        if (!!result && result.printTicket) {
          this.imprimirCarritoOnClick();
        } else if (!!result) {
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

  // Abre el diálogo para editar un producto
  agregarProductoNuevoOnClick(): void {
    const dialogRef = this.dialog.open(AgregarProductoModalComponent, {
      width: "500px",
      data: {
        productos: [...this.todosProductos],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (!!result) {
        this.obtenerProductos();
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
