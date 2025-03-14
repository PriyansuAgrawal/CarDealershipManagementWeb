import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarModelRoutingModule } from './car-model-routing.module';
import { CarModelListComponent } from './car-model-list/car-model-list.component';
import { CarModelFormComponent } from './car-model-form/car-model-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { CarModelDetailComponent } from './car-model-detail/car-model-detail.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    CarModelListComponent,
    CarModelFormComponent,
    ImageUploadComponent,
    CarModelDetailComponent
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    CarModelRoutingModule,
    SharedModule
  ]
})
export class CarModelModule { }
