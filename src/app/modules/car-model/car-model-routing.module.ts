import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarModelListComponent } from './car-model-list/car-model-list.component';
import { CarModelFormComponent } from './car-model-form/car-model-form.component';
import { CarModelDetailComponent } from './car-model-detail/car-model-detail.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'models',
    pathMatch:'full'
  },
  {
    path: 'models',
    component:CarModelListComponent
  },
  {
    path: 'create',
    component:CarModelFormComponent
  },
  {
    path: 'edit/:id',
    component:CarModelFormComponent
  },
  {
    path: 'view/:id',
    component:CarModelDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
