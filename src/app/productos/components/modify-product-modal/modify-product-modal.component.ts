import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Producto } from '../../models/producto.interface';

@Component({
  selector: "app-modify-product-modal",
  templateUrl: "./modify-product-modal.component.html",
  styleUrls: ["./modify-product-modal.component.css"],
})
export class ModifyProductModalComponent implements OnInit {
  formInsertarProducto: UntypedFormGroup;
  producto?: Producto;
  productos: Producto[] = [];
  productosCodigo: Producto[] = [];
  productosMarca: Producto[] = [];

  @ViewChild("codigoInput") codigoInput: any;
  @ViewChild("marcaInput") marcaInput: any;
  @ViewChild("precioInput") precioInput: any;
  @ViewChild("descripcionInput") descripcionInput: any;

  constructor(
    public dialogRef: MatDialogRef<ModifyProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formInsertarProducto = new UntypedFormGroup({
      descripcion: new UntypedFormControl(null, Validators.required),
      precio: new UntypedFormControl(null, Validators.required),
      codigo: new UntypedFormControl(null, Validators.required),
      marca: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.producto = this.data.producto;
    this.productos = this.data.productos;
    this.formInsertarProducto.patchValue({ ...this.producto });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Verifica si el código del producto ya se encuentra registrado
  codigoExiste(event: any): void {
    const codigo: string = event.target.value;
    if (this.formInsertarProducto.controls["codigo"].valid) {
      if (
        this.productos.some(
          (producto) =>
            producto.codigo.toLowerCase() === codigo.toLowerCase() &&
            producto.id !== this.producto?.id
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
  }

  // Filtra los códigos registrados de los productos
  filtrarCodigo(event: any): void {
    let codigo: string = event.target.value;
    codigo = codigo.trim();
    this.productosCodigo = this.data.productos.filter(
      (producto: Producto) =>
        producto.codigo !== this.producto!.codigo.toLowerCase() &&
        producto.codigo.toLowerCase().startsWith(codigo.toLowerCase())
    );
  }

  // Filtra las marcas registradas de los productos
  filtrarMarca(event: any): void {
    let marca: string = event.target.value;
    if (!!marca) {
      marca = marca.trim();
      this.productosMarca = this.data.productos.filter((producto: Producto) =>
        producto.marca.toLowerCase().includes(marca.toLowerCase())
      );
    } else {
      this.productosMarca = [...this.productos];
    }
  }

  // Controla la tecla enter en el campo de código
  codigoOnKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.marcaInput.nativeElement.focus();
    } else {
      this.filtrarCodigo(event);
    }
  }

  // Controla la tecla enter en el campo de marca
  marcaOnKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.precioInput.nativeElement.focus();
    } else {
      this.filtrarMarca(event);
    }
  }

  // Controla la tecla enter en el campo de precio
  precioOnKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.descripcionInput.nativeElement.focus();
    }
  }

  // Controla la tecla enter en el campo de descripción
  descripcionOnKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.dialogRef.close(this.formInsertarProducto.value);
    }
  }
}
