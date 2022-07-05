import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DemoMaterialModule } from '../demo-material-module';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogModule } from '@angular/material/dialog';
import { VendedorComponent } from './vendedor/vendedor.component';
import { IngresarCantidadModalComponent } from './vendedor/ingresar-cantidad-modal/ingresar-cantidad-modal.component';
import { TicketComponent } from './vendedor/ticket/ticket.component';
import { CambioModalComponent } from './vendedor/cambio-modal/cambio-modal.component';
import { ConfirmCancelModalComponent } from './vendedor/confirm-cancel-modal/confirm-cancel-modal.component';
import { AgregarProductoModalComponent } from './vendedor/agregar-producto-modal/agregar-producto-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    SweetAlert2Module,
    MatDialogModule,
  ],
  providers: [],
  declarations: [
    VendedorComponent,
    IngresarCantidadModalComponent,
    TicketComponent,
    CambioModalComponent,
    ConfirmCancelModalComponent,
    AgregarProductoModalComponent,
  ]
})
export class MaterialComponentsModule {}
