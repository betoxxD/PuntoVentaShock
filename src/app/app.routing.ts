import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/vendedor',
        pathMatch: 'full'
      },
      {
        path: 'productos',
        loadChildren:
          () => import('./productos/productos.module').then(m => m.ProductosModule)
      },
      {
        path: 'vendedor',
        loadChildren: () => import('./vendedor/vendedor.module').then(m => m.VendedorModule)
      }
    ]
  }
];
