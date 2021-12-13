import { Producto } from './prodicto.interface';
export interface CarritoDetalle {
    producto: Producto,
    cantidad: number,
    subtotal: number
}