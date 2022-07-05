import { CarritoDetalle } from './carritoDetalle.interface';
import { Producto } from '../productos/models/producto.interface';
export interface Carrito {
    id: number,
    carritoDetalles: CarritoDetalle[],
    total: number
}
