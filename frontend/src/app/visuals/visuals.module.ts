import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { VisualsRoutingModule } from './visuals-routing.module';



@NgModule({
  declarations: [
    NavbarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    VisualsRoutingModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class VisualsModule { }
