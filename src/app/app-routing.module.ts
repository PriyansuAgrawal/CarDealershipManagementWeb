import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'cars',
        loadChildren: () => import('./modules/car-model/car-model.module').then(m => m.CarModelModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule),
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['Admin', 'Manager','Salesperson'] }
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
