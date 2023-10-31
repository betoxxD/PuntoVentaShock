import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { Producto } from "../../../productos/models/producto.interface";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";

@Component({
  selector: "app-ingresar-cantidad-modal",
  templateUrl: "./ingresar-cantidad-modal.component.html",
  styleUrls: ["./ingresar-cantidad-modal.component.css"],
})
export class IngresarCantidadModalComponent implements OnInit {
  @ViewChild("btnCancelar") btnCancelar!: MatButton;
  @ViewChild("btnAceptar") btnAceptar!: MatButton;

  cantidad: number = 1;
  producto?: Producto;

  constructor(
    public dialogRef: MatDialogRef<IngresarCantidadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.producto = this.data.producto;
    if (!!this.producto?.cantidad) {
      this.cantidad = this.producto.cantidad;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    if (this.cantidad < 1) {
      this._snackBar.open("La cantidad debe ser mayor a 0", "", {
        duration: 2000,
      });
    } else {
      this.dialogRef.close(this.cantidad);
    }
  }

  aceptarOnKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft") {
      this.btnCancelar.focus();
    }
  }

  cancelarOnKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowRight") {
      this.btnAceptar.focus();
    }
  }
}
