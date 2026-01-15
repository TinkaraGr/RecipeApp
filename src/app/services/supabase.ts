import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { SupabaseClient, createClient, User } from '@supabase/supabase-js';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // AVTENTIKACIJA
  signUp(email: string, password: string): Observable<any> {
    return from(
      this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      })
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  signIn(email: string, password: string): Observable<any> {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      map(() => undefined),
      catchError(err => throwError(() => err))
    );
  }

  getUser(): Observable<User | null> {
    return from(this.supabase.auth.getUser()).pipe(
      map(res => res.data.user || null),
      catchError(err => throwError(() => err))
    );
  }

  getToken(): Observable<string | null> {
    return from(this.supabase.auth.getSession()).pipe(
      map(res => res.data.session?.access_token || null),
      catchError(err => throwError(() => err))
    );
  }

  // RECEPTI
  getRecipes(): Observable<any[]> {
    return from(
      this.supabase
        .from('Recipe')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  getRecipeById(id: number): Observable<any> {
    return from(
      this.supabase
        .from('Recipe')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  addRecipe(recipe: any): Observable<any> {
    return from(
      this.supabase
        .from('Recipe')
        .insert([recipe])
        .select()
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateRecipe(id: number, recipe: any): Observable<any> {
    return from(
      this.supabase
        .from('Recipe')
        .update(recipe)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return from(
      this.supabase
        .from('Recipe')
        .delete()
        .eq('id', id)
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
      }),
      catchError(err => throwError(() => err))
    );
  }
}