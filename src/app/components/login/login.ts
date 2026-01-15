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

  login() {
    if (!this.email || !this.password) {
      this.alert.showError('Vnesite email in geslo');
      return;
    }

    this.isLoading = true;

    this.supabase.signIn(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.error) {
          this.alert.showError(response.error.message || 'Napaka pri prijavi');
        } else {
          this.alert.showSuccess('Uspešno prijavljeni!');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.alert.showError(error.message || 'Napaka pri prijavi');
      }
    });
  }
}