import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RecipesService } from '../../../../core/services/recipes-service';

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
  
  // Spremenljivke za upravljanje menija za posamezen recept
  activeMenuRecipeId: number | null = null;
  showDeleteConfirmForId: number | null = null;
  
  constructor(
    private router: Router,
    private recipesService: RecipesService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipesService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data || [];
        this.filteredRecipes = [...this.recipes];
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        alert('Napaka pri nalaganju receptov: ' + error?.message);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Zapri vse odprte menije, če kliknemo zunaj
    if (this.activeMenuRecipeId !== null) {
      this.activeMenuRecipeId = null;
    }
    if (this.showDeleteConfirmForId !== null) {
      this.showDeleteConfirmForId = null;
    }
  }
  
  getLevelText(level: number): string {
    switch(level) {
      case 1: return 'Lažji';
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
  
  viewRecipe(recipeId: number) {
    if (recipeId) {
      this.router.navigate(['/recipe', recipeId]);
    }
  }

  toggleMenu(event: Event, recipeId: number) {
    event.stopPropagation();
    if (this.activeMenuRecipeId === recipeId) {
      this.activeMenuRecipeId = null;
    } else {
      this.activeMenuRecipeId = recipeId;
      this.showDeleteConfirmForId = null;
    }
  }
  
  editRecipe(event: Event, recipeId: number) {
    event.stopPropagation();
    this.activeMenuRecipeId = null;
    if (recipeId) {
      this.router.navigate(['/edit-recipe', recipeId]);
    }
  }
  
  deleteRecipe(event: Event, recipeId: number) {
    event.stopPropagation();
    this.activeMenuRecipeId = null;
    this.showDeleteConfirmForId = recipeId;
  }

  confirmDelete(event: Event, recipeId: number) {
    event.stopPropagation();
    
    this.recipesService.deleteRecipe(recipeId).subscribe({
      next: () => {
        // Odstrani recept iz seznamov
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        this.filteredRecipes = this.filteredRecipes.filter(recipe => recipe.id !== recipeId);
        this.showDeleteConfirmForId = null;
        this.activeMenuRecipeId = null;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Napaka pri brisanju recepta:', error);
        this.showDeleteConfirmForId = null;
        alert('Napaka pri brisanju recepta: ' + error?.message);
      }
    });
  }

  cancelDelete(event: Event) {
    event.stopPropagation();
    this.showDeleteConfirmForId = null;
    this.activeMenuRecipeId = null;
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

  getRecipeById(recipeId: number) {
    return this.recipes.find(recipe => recipe.id === recipeId);
  }

  // Pomagalne metode za preverjanje stanja
  isMenuOpen(recipeId: number): boolean {
    return this.activeMenuRecipeId === recipeId;
  }

  isDeleteConfirmOpen(recipeId: number): boolean {
    return this.showDeleteConfirmForId === recipeId;
  }
}