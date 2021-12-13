import { CarritoDetalle } from './carritoDetalle.interface';
import { Producto } from './prodicto.interface';
export interface Carrito {
    id: number,
    carritoDetalles: CarritoDetalle[],
    total: number
}
