import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-cambio-modal',
  templateUrl: './cambio-modal.component.html',
  styleUrls: ['./cambio-modal.component.css']
})
export class CambioModalComponent implements OnInit {

  total: number = 0;
  pago: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CambioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {
    this.total = data.total;
  }

  ngOnInit(): void {
      
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    if((this.pago - this.total) < 0) {
      this._snackBar.open('El pago no cubre el total', '', {
        duration: 2000
      });
    }else {
      this.dialogRef.close(this.pago);
    }
  }

}
