import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModifyProductModalComponent } from "./components/modify-product-modal/modify-product-modal.component";
import { ProductosComponent } from "./pages/productos/productos.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CdkTableModule } from "@angular/cdk/table";
import { ProductosRoutingModule } from "./productos-routing.module";
import { DemoMaterialModule } from "../demo-material-module";

@NgModule({
  declarations: [ModifyProductModalComponent, ProductosComponent],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    CdkTableModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DemoMaterialModule,
  ],
})
export class ProductosModule {}
