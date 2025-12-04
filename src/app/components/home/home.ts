import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  userEmail: string = '';
  userName: string = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.supabase.getUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userEmail = user.email || '';
  }


  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}