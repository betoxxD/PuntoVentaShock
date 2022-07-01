import { CarritoDetalle } from './carritoDetalle.interface';
import { Producto } from './producto.interface';
export interface Carrito {
    id: number,
    carritoDetalles: CarritoDetalle[],
    total: number
}
