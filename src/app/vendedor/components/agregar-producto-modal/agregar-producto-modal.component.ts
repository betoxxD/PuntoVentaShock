import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";
import { Producto } from "../../../productos/models/producto.interface";
import { ProductosService } from "src/app/productos/services/productos.service";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";

@Component({
  selector: "app-agregar-producto-modal",
  templateUrl: "./agregar-producto-modal.component.html",
  styleUrls: ["./agregar-producto-modal.component.css"],
})
export class AgregarProductoModalComponent implements OnInit {
  @ViewChild("codigo") codigo!: any;
  @ViewChild("marca") marca!: any;
  @ViewChild("precio") precio!: any;
  @ViewChild("descripcion") descripcion!: any;
  @ViewChild("btnAceptar") btnAceptar!: MatButton;
  @ViewChild("btnCancelar") btnCancelar!: MatButton;

  formInsertarProducto: UntypedFormGroup;
  producto?: Producto;

  todosProductos: Producto[] = [];
  productos: Producto[] = [];
  productosMarca: Producto[] = [];

  constructor(
    public dialogRef: MatDialogRef<AgregarProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public productosService: ProductosService,
    public toast: MatSnackBar
  ) {
    this.formInsertarProducto = new UntypedFormGroup({
      descripcion: new UntypedFormControl(null, Validators.required),
      precio: new UntypedFormControl(null, Validators.required),
      codigo: new UntypedFormControl(null, Validators.required),
      marca: new UntypedFormControl(null, Validators.required),
    });
    this.todosProductos = this.data.productos;
    console.log(this.data);
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Inserta un producto en la base de datos
  insertarProducto(): void {
    if (this.formInsertarProducto.valid) {
      this.productosService
        .insert({ ...this.formInsertarProducto.value })
        .subscribe(
          (producto: any) => {
            this.formInsertarProducto.reset();
            this.showToast("Producto agregado");
            this.dialogRef.close(true);
          },
          (error) => {
            console.log(error);
            this.showToast(error.error.mensaje);
          }
        );
    } else {
      console.log("Formulario invalido");
    }
  }

  // Muestra un mensaje de toast
  showToast(mensaje: string): void {
    this.toast.open(mensaje, "", {
      duration: 2000,
      panelClass: ["snackbar-success"],
    });
  }

  // Verifica si el código del producto ya se encuentra registrado
  codigoExiste(event: any): void {
    const codigo: string = this.formInsertarProducto.value.codigo;
    if (this.formInsertarProducto.controls["codigo"].valid) {
      if (
        this.productos.some(
          (producto) => producto.codigo.toLowerCase() === codigo.toLowerCase()
        )
      ) {
        this.formInsertarProducto.controls["codigo"].setErrors({
          existingCode: true,
        });
        console.log(this.formInsertarProducto.controls["codigo"].errors);
      } else {
        this.formInsertarProducto.controls["codigo"].setErrors(null);
      }
    }
    if (event.key === "Enter") {
      this.marca.nativeElement.focus();
    }
  }

  marcaOnkeyDown(event: any): void {
    if (event.key === "Enter") {
      this.precio.nativeElement.focus();
    }
  }

  precioOnkeyDown(event: any): void {
    if (event.key === "Enter") {
      this.descripcion.nativeElement.focus();
    }
  }

  descripcionOnkeyDown(event: any): void {
    if (event.key === "Enter") {
      this.btnAceptar.focus();
    }
  }

  // Filtra los productos de acuerdo al valor ingresado en el buscador
  filtrarProductosOnInput(event: any) {
    let valor = event.target.value;
    valor = valor.trim();
    if (!!valor && valor.length > 0) {
      this.productos = this.todosProductos.filter((producto: Producto) => {
        return producto.codigo.toLowerCase().startsWith(valor.toLowerCase());
      });
    } else {
      this.productos = [];
    }
  }

  // Filtra los productos de acuerdo a la marca ingresada en el campo correspondiente
  filtrarProductosMarcaOnInput(event: any) {
    let valor = event.target.value;
    valor = valor.trim();
    if (!!valor && valor.length > 0) {
      this.productosMarca = this.todosProductos.filter((producto: Producto) => {
        return producto.marca.toLowerCase().includes(valor.toLowerCase());
      });
    } else {
      this.productosMarca = [];
    }
  }
}
