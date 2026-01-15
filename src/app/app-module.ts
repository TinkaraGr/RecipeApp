import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { FormsModule } from '@angular/forms';
import { Login } from './components/login/login';
import { Recipe } from './components/recipe/recipe';
import { RecipeDetail } from './components/recipe-detail/recipe-detail';
import { AddRecipe } from './components/add-recipe/add-recipe';
import { EditRecipe } from './components/edit-recipe/edit-recipe';


@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Home,
    Recipe,
    RecipeDetail,
    AddRecipe,
    EditRecipe,
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
