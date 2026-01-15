import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.css']
})
export class RecipeDetail implements OnInit {
  recipe: any = null;
  isLoading = true;
  ingredientChecked: boolean[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadRecipe(parseInt(id));
    }
  }

  loadRecipe(id: number) {
    this.isLoading = true;
    
    this.supabase.getRecipeById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        const ingredientsCount = this.getIngredientsList().length;
        this.ingredientChecked = new Array(ingredientsCount).fill(false);
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

  getLevelText(level: number): string {
    switch(level) {
      case 1: return 'Začetnik';
      case 2: return 'Srednji';
      case 3: return 'Napreden';
      default: return 'Nedoločeno';
    }
  }

  getLevelClass(level: number): string {
    switch(level) {
      case 1: return 'bg-success';
      case 2: return 'bg-warning';
      case 3: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getIngredientsList(): string[] {
    if (!this.recipe?.ingredients) return [];
    return this.recipe.ingredients.split(';').map((item: string) => item.trim());
  }

  toggleIngredient(index: number) {
    this.ingredientChecked[index] = !this.ingredientChecked[index];
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