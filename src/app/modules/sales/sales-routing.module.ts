import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionReportComponent } from './commission-report/commission-report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'commission-reports',
    pathMatch: 'full'
  }
  ,{
    path: 'commission-reports',
    component: CommissionReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
