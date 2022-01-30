import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from '../../../models/prodicto.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
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
    if(this.cantidad < 1) {
      this._snackBar.open('La cantidad debe ser mayor a 0', 'Cerrar');
    }else {
      this.dialogRef.close(this.cantidad);
    }
  }

}
