import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { AlertService } from '../../services/alert';



@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private alert: AlertService
  ) {}

  async login() {

    if (!this.email || !this.password) {
      this.alert.showError('Vnesite email in geslo');
      return;
    }

    this.isLoading = true;

    const { error } = await this.supabase.signIn(this.email, this.password);
    
    this.isLoading = false;
    
    if (error) {
      this.alert.showError(error.message || 'Napaka pri prijavi');
    } else {
      this.alert.showSuccess('Uspešno prijavljen!');
      setTimeout(() => this.router.navigate(['/home']), 1500);
    }
  }
}