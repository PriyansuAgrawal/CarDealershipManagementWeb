import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { CommissionReportComponent } from './commission-report/commission-report.component';
import { SalesmanDetailComponent } from './salesman-detail/salesman-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesRecordComponent } from './sales-record/sales-record.component';


@NgModule({
  declarations: [
    CommissionReportComponent,
    SalesmanDetailComponent,
    SalesRecordComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ]
})
export class SalesModule { }
