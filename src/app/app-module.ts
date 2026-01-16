import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Uvoz FormsMoule
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Login } from './features/authentication/pages/login/login';
import { Register } from './features/authentication/pages/register/register';
import { Home } from './features/recipes/pages/home/home';
import { RecipeDetail } from './features/recipes/pages/recipe-detail/recipe-detail';
import { AddRecipe } from './features/recipes/pages/add-recipe/add-recipe';
import { EditRecipe } from './features/recipes/pages/edit-recipe/edit-recipe';

// Uvoz provideHttpClient
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Storitve
import { RecipesService } from './core/services/recipes-service';
import { AuthService } from './core/services/auth-service';

// Prestrezniki
import { recipesInterceptor } from './core/interceptors/recipes-interceptor';

@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    Login,
    Register,
    Home,
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
    provideHttpClient(withInterceptors([recipesInterceptor])),
    RecipesService,
    AuthService
  ],
  bootstrap: [App]
})
export class AppModule { }
