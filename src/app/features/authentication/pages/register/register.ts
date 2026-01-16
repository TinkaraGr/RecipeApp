import { Component } from '@angular/core';
import { User } from '../../../../shared/classes/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  public user: User;
  public confirmPassword: string = '';
  public confirmed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = new User (-1,'','')
  }

  public onSubmit(regForm: NgForm): void {
    if (regForm.valid && this.confirmPassword === this.user.password) {
      console.log(`Registracija uporabnika:\nEmail: ${this.user.email}\nGeslo: ${this.user.password}`);
      alert('Račun uspešno ustvarjen! Preverite email.');

      this.authService.registerUser(this.user).subscribe({
        next: (data) => {
          this.authService.setToken("Bearer " + data.token);
          this.router.navigate(['login']);
        },
        error: (error) => {
          console.error('Napaka pri registraciji:', error);
          alert('Napaka pri registraciji');
        }
      });
    } else {
      alert("Obrazec ni ustrezno izpolnjen ali gesli se ne ujemata!");
      console.log("Obrazec ni ustrezno izpolnjen ali gesli se ne ujemata!");
    }
  }
}