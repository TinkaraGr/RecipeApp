import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-add-recipe',
  standalone: false,
  templateUrl: './add-recipe.html',
  styleUrls: ['./add-recipe.css']
})
export class AddRecipe {
  recipe = {
    title: '',
    image: '',
    level: '',
    time: '',
    ingredients: '',
    description: ''
  };
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  getLevelOptions() {
    return [
      { value: '', label: 'Izberi težavnost', disabled: true },
      { value: '1', label: 'Lažji' },
      { value: '2', label: 'Srednji' },
      { value: '3', label: 'Napreden' }
    ];
  }

  formatIngredients(ingredients: string): string {
    return ingredients
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .join(';');
  }

  onSubmit() {
    if (!this.recipe.title || !this.recipe.level || !this.recipe.time || 
        !this.recipe.ingredients || !this.recipe.description) {
      this.errorMessage = 'Prosim izpolni vsa obvezna polja (*).';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const recipeData = {
      title: this.recipe.title,
      image: this.recipe.image || null,
      level: parseInt(this.recipe.level),
      time: this.recipe.time.toString(),
      ingredients: this.formatIngredients(this.recipe.ingredients),
      description: this.recipe.description
    };

    this.supabase.addRecipe(recipeData).subscribe({
      next: (data) => {
        this.successMessage = 'Recept uspešno dodan!';
        
        this.recipe = {
          title: '',
          image: '',
          level: '',
          time: '',
          ingredients: '',
          description: ''
        };
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Napaka pri shranjevanju recepta: ' + error.message;
        console.error('Error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
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
}