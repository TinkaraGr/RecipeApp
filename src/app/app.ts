import { Component, OnInit, signal } from '@angular/core';

import { AuthService } from './core/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Recipes-App');
  
  constructor(private authService: AuthService) {}

  public isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    //this.loggedIn = this.authService.isLoggedIn();
  }

}