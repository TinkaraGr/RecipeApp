import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchQuery: string = '';
  
  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit() {
      this.loadRecipes();
  }

  logout() {
    this.supabase.signOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  loadRecipes() {
    this.supabase.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data || [];
        this.filteredRecipes = [...this.recipes];
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredRecipes = [...this.recipes];
      this.cdRef.detectChanges();
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    
    this.filteredRecipes = this.recipes.filter(recipe => {
      if (recipe.title?.toLowerCase().includes(query)) return true;
      if (recipe.ingredients?.toLowerCase().includes(query)) return true;
      if (recipe.description?.toLowerCase().includes(query)) return true;
      return false;
    });
    
    this.cdRef.detectChanges();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredRecipes = [...this.recipes];
    this.cdRef.detectChanges();
  }

  onRecipeDeleted(recipeId: number) {
    this.supabase.deleteRecipe(recipeId).subscribe({
      next: () => {
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        this.filteredRecipes = this.filteredRecipes.filter(recipe => recipe.id !== recipeId);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting recipe:', error);
        alert('Napaka pri brisanju recepta: ' + error?.message);
      }
    });
  }
}