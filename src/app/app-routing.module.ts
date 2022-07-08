import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FullComponent } from "./layouts/full/full.component";

const routes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      {
        path: "",
        redirectTo: "vendedor",
        pathMatch: "full",
      },
      {
        path: "vendedor",
        loadChildren: () =>
          import("./vendedor/vendedor.module").then((m) => m.VendedorModule),
      },
      {
        path: "productos",
        loadChildren: () =>
          import("./productos/productos.module").then((m) => m.ProductosModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
