import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";

@Component({
  selector: "app-cambio-modal",
  templateUrl: "./cambio-modal.component.html",
  styleUrls: ["./cambio-modal.component.css"],
})
export class CambioModalComponent implements OnInit {
  @ViewChild("btnCancelar") btnCancelar!: MatButton;
  @ViewChild("btnAceptar") btnAceptar!: MatButton;

  total: number = 0;
  pago: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CambioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {
    this.total = data.total;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    if (this.pago - this.total < 0) {
      this._snackBar.open("El pago no cubre el total", "", {
        duration: 2000,
      });
    } else {
      this.dialogRef.close(this.pago);
    }
  }

  // Maneja el evento de presión de tecla en el botón cancelar
  cancelarOnKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      this.btnAceptar.focus();
    }
  }

  // Maneja el evento de presión de tecla en el botón aceptar
  aceptarOnKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.btnCancelar.focus();
    }
  }
}
