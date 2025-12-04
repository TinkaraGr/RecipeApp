import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { FormsModule } from '@angular/forms';
import { Login } from './components/login/login';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
