import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { CsvLoaderComponent } from './csv-loader/csv-loader.component';
import { DeckManagerComponent } from './deck-manager/deck-manager.component';
import { DeckGeneratorComponent } from './deck-generator/deck-generator.component';

const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent
  },
  {
    path: 'editor/:id',
    component: EditorComponent
  },
  {
    path: 'csv',
    component: CsvLoaderComponent
  },
  {
    path: 'csv/:id', 
    component: CsvLoaderComponent
  },
  {
    path: 'manager',
    component: DeckManagerComponent
  },
  {
    path: 'generate-deck/:templateId',
    component: DeckGeneratorComponent 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule {}
