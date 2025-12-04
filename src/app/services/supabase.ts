import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { SupabaseClient, AuthSession, createClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    
    // Naloži session ob inicializaciji
    this.loadSession();
    
    // Poslušaj spremembe avtentikacije
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session = session;
      console.log('Auth state changed:', _event, session?.user?.email);
    });
  }

  private async loadSession() {
    const { data } = await this.supabase.auth.getSession();
    this._session = data.session;
  }

  get session(): AuthSession | null {
    return this._session;
  }

  get user(): User | null {
    return this._session?.user || null;
  }

  get isAuthenticated(): boolean {
    return !!this._session;
  }

  // REGISTRACIJA z email/geslo
  async signUp(email: string, password: string) {
    try {
      console.log('Registracija:', email);
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      console.log('Registracija rezultat:', { data, error });
      return { data, error };
    } catch (error: any) {
      console.error('Registracija napaka:', error);
      return { data: null, error };
    }
  }

  // PRIJAVA z email/geslo
  async signIn(email: string, password: string) {
    try {
      console.log('Prijava:', email);
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Prijava rezultat:', { 
        user: data?.user?.email,
        hasSession: !!data?.session,
        error 
      });
      
      if (data?.session) {
        this._session = data.session;
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Prijava napaka:', error);
      return { data: null, error };
    }
  }

  // ODJAVA
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      this._session = null;
      return { error };
    } catch (error: any) {
      console.error('Odjava napaka:', error);
      return { error };
    }
  }

  // PRIDOBI TOKEN (JWT)
  async getToken(): Promise<string | null> {
    if (this._session?.access_token) {
      return this._session.access_token;
    }
    
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  // PRIDOBI UPORABNIKA
  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }
}