import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { finalize } from 'rxjs';
import { SharedModules } from '../../../../../shared/shared.module';
import { CategoryForm, CategoryFormMode } from '../../components/category-form/category-form';
import { CategoriesService } from '../../categories.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    ...SharedModules,
    MatMenuModule,
    CategoryForm,
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})

export class CategoriesPage implements OnInit {
  private categoriesService = inject(CategoriesService);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  // ================= STATE =================
  searchText = '';
  formMode: CategoryFormMode | null = null;
  selectedCategory: Category | null = null;
  contextCategory: Category | null = null;
  categories: Category[] = [];
  allCategories: Category[] = [];
  isLoading = false;
  isSubmitting = false;

  // ================= INIT =================
  ngOnInit(): void {
    this.loadCategories();
  }

  // ================= UTILS =================
  private resetEditor(): void {
    this.formMode = null;
    this.selectedCategory = null;
    this.isSubmitting = false;
  }

  private flattenCategories(categories: Category[]): Category[] {
    const result: Category[] = [];
    const traverse = (items: Category[]) => {
      for (const item of items) {
        result.push(item);
        if (item.children?.length) {
          traverse(item.children);
        }
      }
    };
    traverse(categories);
    return result;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private handleError(error: any): void {
    const message =
      error?.error?.message ?? 'An unexpected error occurred';
    console.error(error);
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
    this.isLoading = false;
    this.isSubmitting = false;
  }

  // ================= DATA =================
  private loadCategories(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.categoriesService.getCategories()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (categories) => {
          this.categories = categories ?? [];
          this.allCategories = this.flattenCategories(this.categories);
          this.cdr.detectChanges();
        },
        error: (error) => this.handleError(error),
      });
  }

  refresh(): void {
    this.contextCategory = null;
    this.resetEditor();
    this.loadCategories();
  }

  // ================= UI ACTIONS =================
  addCategory(): void {
    this.selectedCategory = null;
    this.formMode = 'create';
  }

  viewCategory(category: Category): void {
    this.selectedCategory = category;
    this.formMode = 'view';
  }

  editCategory(category: Category | null): void {
    if (!category) return;
    this.selectedCategory = category;
    this.formMode = 'edit';
  }

  addSubcategory(parent: Category | null): void {
    if (!parent) return;
    this.selectedCategory = parent;
    this.formMode = 'add-subcategory';
  }

  setContextCategory(category: Category): void {
    this.contextCategory = category;
  }

  // ================= CRUD =================
  saveCategory(category: any): void {
    if (!category || this.isSubmitting) return;
    this.isSubmitting = true;
    const payload = {
      name: category.name,
      description: category.description,
      parentId: category.parentId,
    };

    // ================= CREATE =================
    if (
      this.formMode === 'create' ||
      this.formMode === 'add-subcategory'
    ) {
      this.categoriesService
        .createCategory(payload)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.showSuccess('Category created');
            this.resetEditor();
            this.loadCategories(); // 🔥 source of truth
          },
          error: (err) => this.handleError(err),
        });
      return;
    }

    // ================= UPDATE =================
    if (this.formMode === 'edit') {
      if (!category.id) {
        this.isSubmitting = false;
        return;
      }
      this.categoriesService
        .updateCategory(category.id, payload)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.showSuccess('Category updated');
            this.resetEditor();
            this.loadCategories(); // 🔥 always reload
          },
          error: (err) => this.handleError(err),
        });
    }
  }

  confirmDelete(category: Category | null): void {
    if (!category?.id) return;
    const snackBarRef = this.snackBar.open(
      `Delete "${category.name}"?`,
      'CONFIRM',
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.deleteCategory(category);
    });
  }

  deleteCategory(category: Category | null): void {
    if (!category?.id || this.isSubmitting) return;
    this.isSubmitting = true;
    this.categoriesService
      .deleteCategory(category.id)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.showSuccess('Category deleted');
          this.resetEditor();
          this.contextCategory = null;
          this.loadCategories(); // consistent refresh
        },
        error: (err) => this.handleError(err),
      });
  }

  // ================= RESET =================
  resetCategories(): void {
    this.snackBar.open(
      'Reset feature not implemented yet',
      'Close',
      { duration: 2000 }
    );
  }
}