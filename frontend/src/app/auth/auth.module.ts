import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginResponse } from '../models/login-response';
import { User } from '../models/user';

@NgModule({
  declarations: [
    LoginComponent  // Declara todos los componentes del módulo
  ],
  imports: [
    CommonModule,
    FormsModule,        // Para formularios template-driven
    ReactiveFormsModule, // Para formularios reactivos
    AuthRoutingModule   // Importa el routing del módulo
  ]
})
export class AuthModule {}