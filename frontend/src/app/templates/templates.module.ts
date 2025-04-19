import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TemplatesRoutingModule
  ]
})
export class TemplatesModule {}
