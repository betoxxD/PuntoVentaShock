import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Producto } from "../../../models/producto.interface";
import { ProductosService } from "src/app/services/productos/productos.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-agregar-producto-modal",
  templateUrl: "./agregar-producto-modal.component.html",
  styleUrls: ["./agregar-producto-modal.component.css"],
})
export class AgregarProductoModalComponent implements OnInit {
  formInsertarProducto: FormGroup;
  producto?: Producto;

  productos: Producto[] = [];

  constructor(
    public dialogRef: MatDialogRef<AgregarProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public productosService: ProductosService,
    public toast: MatSnackBar
  ) {
    this.formInsertarProducto = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      precio: new FormControl(null, Validators.required),
      codigo: new FormControl(null, Validators.required),
      marca: new FormControl(null, Validators.required),
    });
    this.productos = this.data.productos;
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
  codigoExiste(): void {
    const codigo: string = this.formInsertarProducto.value.codigo;
    if(this.formInsertarProducto.controls['codigo'].valid) {
      console.log(!this.productos.some(producto => producto.codigo === codigo));
      if(this.productos.some(producto => producto.codigo.toLowerCase() === codigo.toLowerCase())) {
        this.formInsertarProducto.controls['codigo'].setErrors({'existingCode': true});
        console.log(this.formInsertarProducto.controls['codigo'].errors);
      } else {
        this.formInsertarProducto.controls['codigo'].setErrors(null);
      }
    }
  }
}
