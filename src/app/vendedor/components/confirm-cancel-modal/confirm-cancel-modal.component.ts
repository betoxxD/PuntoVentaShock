import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-confirm-cancel-modal",
  templateUrl: "./confirm-cancel-modal.component.html",
  styleUrls: ["./confirm-cancel-modal.component.css"],
})
export class ConfirmCancelModalComponent implements OnInit {
  @ViewChild("cancelarButton") cancelarButton!: MatButton;
  @ViewChild("aceptarButton") aceptarButton!: MatButton;

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    let functionKeys: string[] = new Array(
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11"
    );
    if (functionKeys.indexOf(event.key) > -1) {
      event.preventDefault();
    }
    console.log(event.key);
    if (event.key === "ArrowRight") {
      this.aceptarButton.focus();
    }
    if (event.key === "ArrowLeft") {
      this.cancelarButton.focus();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmCancelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeWithData(): void {
    this.dialogRef.close("Aceptar");
  }

  keypressCancel(event: KeyboardEvent): void {
    console.log(event.key);
    if (event.key === "Enter") {
    }
  }
}
