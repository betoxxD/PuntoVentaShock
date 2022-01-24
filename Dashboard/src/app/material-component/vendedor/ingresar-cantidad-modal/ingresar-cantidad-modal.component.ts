import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from '../../../models/prodicto.interface';

@Component({
  selector: 'app-ingresar-cantidad-modal',
  templateUrl: './ingresar-cantidad-modal.component.html',
  styleUrls: ['./ingresar-cantidad-modal.component.css']
})
export class IngresarCantidadModalComponent implements OnInit {

  cantidad: number = 1;
  producto?: Producto;

  constructor(
    public dialogRef: MatDialogRef<IngresarCantidadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.producto = this.data.producto;
    if(!!this.producto?.cantidad) {
      this.cantidad = this.producto.cantidad;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    this.dialogRef.close(this.cantidad);
  }

}
