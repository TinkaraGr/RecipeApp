import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  // URL za API receptov
  private apiUrl = 'http://localhost:3000/api/recipes';
  
  constructor(private http: HttpClient) {}

  // GET - metoda za pridobivanje vseh receptov
  public getAllRecipes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  // GET - metoda za pridobivanje posameznega recepta po ID-ju
  public getRecipeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  // POST - metoda za ustvarjanje novega recepta
  public createRecipe(recipeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recipeData);
  }
  
  // PUT - metoda za posodabljanje obstojecega recepta po ID-ju
  public updateRecipe(id: number, recipeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, recipeData);
  }
  
  // DELETE - metoda za brisanje recepta po ID-ju
  public deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}