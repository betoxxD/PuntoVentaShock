import { Producto } from '../productos/models/producto.interface';
export interface CarritoDetalle {
    producto: Producto,
    cantidad: number,
    subtotal: number
}