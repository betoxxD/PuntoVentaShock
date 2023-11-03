import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild,
} from "@angular/core";
import { MatLegacyButton as MatButton } from "@angular/material/legacy-button";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import * as printJS from "print-js";
import { Producto } from "../../../productos/models/producto.interface";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  @ViewChild("btnAceptar") btnAceptar!: MatButton;
  @ViewChild("btnTicket") btnTicket!: MatButton;
  @ViewChild("btnCancelar") btnCancelar!: MatButton;

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
  }

  carrito: Producto[] = [];

  constructor(
    public dialogRef: MatDialogRef<TicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.carrito = this.data.carrito;
  }

  ngAfterViewInit(): void {
    this.imprimirCarrito();
  }

  // Imprime el contenido en el div con id "ticket"
  async imprimirCarrito() {
    printJS({
      printable: "ticket",
      type: "html",
      style: `
      @font-face {
        font-family: Roboto;
        src: url(assets/fonts/Roboto-Regular.ttf) format("opentype");
      }
      
      * {
	font-family: 'Roboto', sans-serif;
	font-size: 12px;
      }

      .informacion-general-contenedor {
  text-align: center;
}

.informacion-general-contenedor p {
  padding: 0;
  margin: 4px;
}

.tabla-productos table {
  width: 95%;
  margin: 0 auto;
}

.nota {
  text-align: center;
}

.fecha-hora {
  text-align: center;
}

.fecha-hora p {
  padding: 0;
  margin: 0;
}
      `,
      scanStyles: false,
    });
  }

  // Calcula el total de la venta
  calcularTotal(): number {
    let total = 0;
    this.carrito.forEach((producto) => {
      total += producto.precio * producto.cantidad!;
    });
    return total;
  }

  // Cuenta el número de prendas en el carrito
  contarPrendas(): number {
    let total = 0;
    this.carrito.forEach((producto) => {
      total += producto.cantidad!;
    });
    return total;
  }

  // Obtiene la fecha actual
  obtenerFechaActual(): string {
    const fecha = new Date();
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  }

  // Obtiene la hora actual
  obtenerHoraActual(): string {
    const fecha = new Date();
    return `${fecha.getHours()}:${fecha.getMinutes()}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Cierra el diálogo retornando un valor
  onClick(): void {
    this.dialogRef.close(true);
  }

  // Maneja el evento de una tecla en el botón de aceptar
  aceptarOnKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowRight") {
      this.btnTicket.focus();
    }
  }

  // Maneja el evento de una tecla en el botón de ticket
  ticketOnKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft") {
      this.btnAceptar.focus();
    } else if (event.key === "ArrowRight") {
      this.btnCancelar.focus();
    } else if (event.key === "Enter") {
      this.imprimirCarrito();
    }
  }

  // Maneja el evento de una tecla en el botón de cancelar
  cancelarOnKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft") {
      this.btnTicket.focus();
    }
  }
}
