import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { Login } from './features/authentication/pages/login/login';
import { Register } from './features/authentication/pages/register/register';
import { Home } from './features/recipes/pages/home/home';
import { RecipeDetail } from './features/recipes/pages/recipe-detail/recipe-detail';
import { AddRecipe } from './features/recipes/pages/add-recipe/add-recipe';
import { EditRecipe } from './features/recipes/pages/edit-recipe/edit-recipe';

//AuthGuard
import { authGuard } from './core/guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'recipe/:id', component: RecipeDetail, canActivate: [authGuard] },
  { path: 'add-recipe', component: AddRecipe, canActivate: [authGuard] },
  { path: 'edit-recipe/:id', component: EditRecipe, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
