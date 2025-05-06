import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsRoutingModule } from './cards-routing.module';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { CsvLoaderComponent } from './csv-loader/csv-loader.component';

@NgModule({
  declarations: [
    EditorComponent,
    CsvLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardsRoutingModule
  ]
})
export class CardsModule {}
