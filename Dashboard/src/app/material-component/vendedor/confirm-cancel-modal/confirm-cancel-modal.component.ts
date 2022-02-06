import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel-modal',
  templateUrl: './confirm-cancel-modal.component.html',
  styleUrls: ['./confirm-cancel-modal.component.css']
})
export class ConfirmCancelModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmCancelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    this.dialogRef.close("Aceptar");
  }

}
