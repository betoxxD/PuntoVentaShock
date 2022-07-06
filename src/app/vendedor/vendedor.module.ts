import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { VendedorComponent } from './pages/vendedor/vendedor.component';
import { AgregarProductoModalComponent } from './components/agregar-producto-modal/agregar-producto-modal.component';
import { CambioModalComponent } from './components/cambio-modal/cambio-modal.component';
import { ConfirmCancelModalComponent } from './components/confirm-cancel-modal/confirm-cancel-modal.component';
import { IngresarCantidadModalComponent } from './components/ingresar-cantidad-modal/ingresar-cantidad-modal.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { DemoMaterialModule } from '../demo-material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    VendedorComponent,
    AgregarProductoModalComponent,
    CambioModalComponent,
    ConfirmCancelModalComponent,
    IngresarCantidadModalComponent,
    TicketComponent
  ],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule
  ]
})
export class VendedorModule { }
