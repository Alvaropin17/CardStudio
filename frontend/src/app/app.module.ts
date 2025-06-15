import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisualsModule } from './modules/visuals/visuals.module';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    VisualsModule,
    CardsModule, 
    HttpClientModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
