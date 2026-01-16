import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  public email: string;
  public password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.email = '';
    this.password = '';
  }

  public onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      let text = `Prijava uporabnika:\nEmail: ${this.email}\nGeslo: ${this.password}`;
      console.log(text);

      this.authService.loginUser({email: this.email, password: this.password}).subscribe({
        next: (data) => {
          this.authService.setToken("Bearer " + data.token);
          this.router.navigate(['home']);
          alert('Prijava je uspešna');
        },
        error: (error) => {
          console.error('Error logging in user:', error)
          alert('Napaka pri prijavi');
        }
      });
    } else {
      alert("Vnesite email in geslo");
      console.log("Vnesite email in geslo");
    }
  }
}