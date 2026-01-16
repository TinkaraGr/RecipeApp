import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL za API avtentikacije
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // POST - metoda za registracijo uporabnika
  public registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  // POST - metoda za prijavo uporabnika
  public loginUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  // Metoda za pridobivanje zetona
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Metoda za shranjevanje zetona
  public setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Metoda za odjavo uporabnika
  public logout(): void {
    localStorage.removeItem('authToken');
  }

  // Metoda za preverjanje, ali je uporabnik prijavljen
  public isLoggedIn(): boolean {
    if (localStorage.getItem('authToken')) {
      return true;
    }
    return false;
  }
}