import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',  // Ruta relativa: /auth/
    component: LoginComponent  // Login como ruta por defecto del módulo
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // ¡Usa forChild()!
  exports: [RouterModule]
})
export class AuthRoutingModule {}