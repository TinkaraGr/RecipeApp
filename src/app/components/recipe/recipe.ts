import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  standalone: false,
  templateUrl: './recipe.html',
  styleUrl: './recipe.css',
})
export class Recipe {
  @Input() recipe: any;
  @Output() recipeDeleted = new EventEmitter<number>();
  showMenu = false;
  showDeleteConfirm = false;
  
  constructor(
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.showMenu) {
      this.showMenu = false;
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
  
  viewRecipe() {
    if (this.recipe.id) {
      this.router.navigate(['/recipe', this.recipe.id]);
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }
  
  editRecipe(event: Event) {
    event.stopPropagation();
    this.showMenu = false;
    if (this.recipe.id) {
      this.router.navigate(['/edit-recipe', this.recipe.id]);
    }
  }
  
  deleteRecipe(event: Event) {
    event.stopPropagation();
    this.showMenu = false;
    this.showDeleteConfirm = true;
  }

  confirmDelete(event: Event) {
    event.stopPropagation();
    this.recipeDeleted.emit(this.recipe.id);
    this.showDeleteConfirm = false;
    this.showMenu = false;
  }

  cancelDelete(event: Event) {
    event.stopPropagation();
    this.showDeleteConfirm = false;
    this.showMenu = false;
  }
}