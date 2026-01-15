import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { RecipeDetail } from './components/recipe-detail/recipe-detail';
import { AddRecipe } from './components/add-recipe/add-recipe';
import { EditRecipe } from './components/edit-recipe/edit-recipe';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'recipe/:id', component: RecipeDetail, canActivate: [AuthGuard] },
  { path: 'add-recipe', component: AddRecipe, canActivate: [AuthGuard] },
  { path: 'edit-recipe/:id', component: EditRecipe, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
