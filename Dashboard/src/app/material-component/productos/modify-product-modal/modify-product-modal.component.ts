import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/models/producto.interface';

@Component({
  selector: 'app-modify-product-modal',
  templateUrl: './modify-product-modal.component.html',
  styleUrls: ['./modify-product-modal.component.css']
})
export class ModifyProductModalComponent implements OnInit {

  formInsertarProducto: FormGroup;
  producto?: Producto;
  productos: Producto[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModifyProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formInsertarProducto = new FormGroup({
      descripcion: new FormControl(null, Validators.required),
      precio: new FormControl(null, Validators.required),
      codigo: new FormControl(null, Validators.required),
      marca: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.producto = this.data.producto;
    this.productos = this.data.productos;
    this.formInsertarProducto.patchValue({...this.producto});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Verifica si el código del producto ya se encuentra registrado
  codigoExiste(): void {
    const codigo: string = this.formInsertarProducto.value.codigo;
    if(this.formInsertarProducto.controls['codigo'].valid) {
      if(this.productos.some(producto => producto.codigo.toLowerCase() === codigo.toLowerCase() && producto.id !== this.producto?.id)) {
        this.formInsertarProducto.controls['codigo'].setErrors({'existingCode': true});
        console.log(this.formInsertarProducto.controls['codigo'].errors);
      } else {
        this.formInsertarProducto.controls['codigo'].setErrors(null);
      }
    }
  }

}
