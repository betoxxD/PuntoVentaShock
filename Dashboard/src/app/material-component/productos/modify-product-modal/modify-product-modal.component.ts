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

  constructor(
    public dialogRef: MatDialogRef<ModifyProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formInsertarProducto = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      descripcion: new FormControl(null, Validators.required),
      precio: new FormControl(null, Validators.required),
      codigo: new FormControl(null, Validators.required),
      marca: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.producto = this.data.producto;
    this.formInsertarProducto.patchValue({...this.producto});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
