import { Producto } from './producto.interface';
export interface CarritoDetalle {
    producto: Producto,
    cantidad: number,
    subtotal: number
}