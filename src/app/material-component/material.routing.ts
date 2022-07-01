import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { VendedorComponent } from './vendedor/vendedor.component';
import { VentasComponent } from './ventas/ventas.component';

export const MaterialRoutes: Routes = [
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'vendedor',
    component: VendedorComponent
  },
  {
    path: 'ventas',
    component: VentasComponent
  }
];
