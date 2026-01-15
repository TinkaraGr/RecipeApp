import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-edit-recipe',
  standalone: false,
  templateUrl: './edit-recipe.html',
  styleUrls: ['./edit-recipe.css']
})
export class EditRecipe implements OnInit {
  recipeId: number = 0;
  recipe = {
    title: '',
    image: '',
    level: '',
    time: '',
    ingredients: '',
    description: ''
  };
  
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    this.supabase.getUser().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          this.loadRecipeFromRoute();
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  loadRecipeFromRoute() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeId = parseInt(id);
      this.loadRecipe(this.recipeId);
    } else {
      this.router.navigate(['/home']);
    }
  }

  loadRecipe(id: number) {
    this.isLoading = true;
    
    this.supabase.getRecipeById(id).subscribe({
      next: (data) => {
        if (data) {
          this.recipe = {
            title: data.title || '',
            image: data.image || '',
            level: data.level?.toString() || '1',
            time: data.time || '',
            ingredients: this.formatIngredientsFromDatabase(data.ingredients || ''),
            description: data.description || ''
          };
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.router.navigate(['/home']);
        this.isLoading = false;
      }
    });
  }

  formatIngredientsFromDatabase(ingredients: string): string {
    if (!ingredients) return '';
    return ingredients.split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .join('\n');
  }

  formatIngredientsToDatabase(ingredients: string): string {
    return ingredients
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .join(';');
  }

  getLevelOptions() {
    return [
      { value: '', label: 'Izberi težavnost', disabled: true },
      { value: '1', label: 'Lažji' },
      { value: '2', label: 'Srednji' },
      { value: '3', label: 'Napreden' }
    ];
  }

  onSubmit() {
    if (!this.recipe.title || !this.recipe.level || !this.recipe.time || 
        !this.recipe.ingredients || !this.recipe.description) {
      this.errorMessage = 'Prosim izpolni vsa obvezna polja (*).';
      this.cdRef.detectChanges();
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdRef.detectChanges();

    const recipeData = {
      title: this.recipe.title,
      image: this.recipe.image || null,
      level: parseInt(this.recipe.level),
      time: this.recipe.time.toString(),
      ingredients: this.formatIngredientsToDatabase(this.recipe.ingredients),
      description: this.recipe.description
    };

    this.supabase.updateRecipe(this.recipeId, recipeData).subscribe({
      next: (data) => {
        this.successMessage = 'Recept uspešno posodobljen!';
        
        setTimeout(() => {
          this.router.navigate(['/recipe', this.recipeId]);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = 'Napaka pri posodabljanju recepta: ' + error.message;
        console.error('Error:', error);
      },
      complete: () => {
        this.isSaving = false;
        this.cdRef.detectChanges();
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