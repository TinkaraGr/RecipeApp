import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { AlertService } from '../../services/alert';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private alert: AlertService
  ) {}

  async register() {
    // Validacija
    if (!this.email || !this.password || !this.confirmPassword) {
      this.alert.showError('Izpolnite vsa polja');
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.alert.showError('Gesli se ne ujemata');
      return;
    }

    if (this.password.length < 6) {
      this.alert.showError('Geslo mora imeti vsaj 6 znakov');
      return;
    }

    this.isLoading = true;
    
    const { error } = await this.supabase.signUp(this.email, this.password);
    
    this.isLoading = false;
    
    if (error) {
      this.alert.showError(error.message || 'Napaka pri registraciji');
    } else {
      this.alert.showSuccess('Račun uspešno ustvarjen! Preverite email.');
      setTimeout(() => this.router.navigate(['/login']), 3000);
    }
  }
}