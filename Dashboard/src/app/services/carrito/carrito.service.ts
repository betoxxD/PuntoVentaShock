import { Injectable } from "@angular/core";
import { Carrito } from "../../models/carrito.interface";
import { CarritoDetalle } from "../../models/carritoDetalle.interface";

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  carrito?: Carrito;

  constructor() {}

  inicializarCarrito(): number {
    let retorno = 0;
    for (let i = 0; i < 100; i++) {
      if (!!!localStorage.getItem(i + "")) {
        this.carrito = {
          id: i,
          carritoDetalles: [],
          total: 0,
        };
        localStorage.setItem(i + "", this.carrito + "");
        retorno = i;
      }
    }
    return retorno;
  }

  cargarStorage(id: number): void {
    this.carrito = { ...JSON.parse(localStorage.getItem(id + "") || "[]") };
  }

  getCarrito(id: number): Carrito {
    this.cargarStorage(id);
    return this.carrito!;
  }

  agregarProducto(producto: CarritoDetalle, id: number): void {
    this.cargarStorage(id);
    console.log(producto);
    const productoExiste = this.carrito!.carritoDetalles.find(
      (item: CarritoDetalle) => item.producto.id == producto.producto.id
    );

    if (!!productoExiste) {
      productoExiste.cantidad += producto.cantidad;
    } else {
      this.carrito?.carritoDetalles.push(producto);
    }

    localStorage.setItem(id + "", JSON.stringify(this.carrito));
  }

  removerStorage(): void {
    localStorage.clear();
  }

  limpiarCarrito(id: number): void {
    this.carrito = undefined;
    localStorage.removeItem(id + "");
  }

  eliminarProducto(id_articulo: number, id: number): void {
    this.cargarStorage(id);
    this.carrito!.carritoDetalles = this.carrito!.carritoDetalles.filter(
      (item: CarritoDetalle) => item.producto.id != id_articulo
    );
    localStorage.setItem(id + "", JSON.stringify(this.carrito));
  }
}
