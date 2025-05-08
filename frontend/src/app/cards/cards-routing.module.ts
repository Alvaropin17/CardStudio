import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { CsvLoaderComponent } from './csv-loader/csv-loader.component';

const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent
  },
  {
    path: 'editor/:id', // Para cargar un template existente
    component: EditorComponent
  },
  {
    path: 'csv',
    component: CsvLoaderComponent
  },
  {
    path: 'csv/:id', // Para ver un CSV existente (si lo implementas)
    component: CsvLoaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule {}
