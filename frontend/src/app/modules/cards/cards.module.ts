import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsRoutingModule } from './cards-routing.module';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { CsvLoaderComponent } from './csv-loader/csv-loader.component';
import { DeckManagerComponent } from './deck-manager/deck-manager.component';
import { DeckGeneratorComponent } from './deck-generator/deck-generator.component';

@NgModule({
  declarations: [
    EditorComponent,
    CsvLoaderComponent,
    DeckManagerComponent,
    DeckGeneratorComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    CardsRoutingModule
  ]
})
export class CardsModule {}
