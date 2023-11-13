import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'productos', type: 'link', name: 'Productos', icon: 'inventory' },
  { state: 'vendedor', type: 'link', name: 'Realizar venta', icon: 'sell' },
  // { state: 'ventas', type: 'link', name: 'Ventas', icon: 'point_of_sale' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
