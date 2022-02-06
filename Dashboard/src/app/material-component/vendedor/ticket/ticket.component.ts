import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as printJS from "print-js";
import { Producto } from "../../../models/producto.interface";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  carrito: Producto[] = [];

  constructor(
    public dialogRef: MatDialogRef<TicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.carrito = this.data.carrito;
    console.log(this.data.carrito);
  }

  ngAfterViewInit(): void {
    this.imprimirCarrito();
  }

  // Imprime el contenido en el div con id "ticket"
  imprimirCarrito() {
    printJS({
      printable: "ticket",
      type: "html",
      style: `
      
      .logo-contenedor {
        text-align: center;
      }
      
      .logo-contenedor h3 {
          margin: 0;
          padding: 0;
        }
      
      .informacion-general-contenedor {
        text-align: center;
      }
      
      .informacion-general-contenedor p {
        padding: 0;
        margin: 4pt;
      }
      
      .tabla-productos {
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
      scanStyles: false
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

  // Obtiene la fecha actual
  obtenerFechaActual(): string {
    const fecha = new Date();
    return `${fecha.getDate()}/${fecha.getMonth() +
      1}/${fecha.getFullYear()}`;
  }

  // Obtiene la hora actual
  obtenerHoraActual(): string {
    const fecha = new Date();
    return `${fecha.getHours()}:${fecha.getMinutes()}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
