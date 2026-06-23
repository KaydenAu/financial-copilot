import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModules } from '../../../../../shared/shared.module';
import { CategoryForm, CategoryFormMode } from '../../components/category-form/category-form';

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

export class CategoriesPage {
  searchText = '';
  formMode: CategoryFormMode | null = null;
  selectedCategory: any = null;
  contextCategory: any = null;

  defaultCategories = [
    {
      id: 1,
      name: 'Electronics',
      type: 'category',
      description: 'Electronic products',
      children: [
        {
          id: 2,
          name: 'Phones',
          type: 'subcategory',
          parentId: 1,
          children: [
            {
              id: 3,
              name: 'Android',
              type: 'subcategory',
              parentId: 2,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Clothing',
      type: 'category',
      description: 'Fashion items',
      children: [],
    },
  ];

  categories = structuredClone(this.defaultCategories);

  addCategory(): void {
    this.selectedCategory = null;
    this.formMode = 'create';
  }

  viewCategory(category: any): void {
    this.selectedCategory = category;
    this.formMode = 'view';
  }

  editCategory(category: any): void {
    this.selectedCategory = category;
    this.formMode = 'edit';
  }

  addSubcategory(parent: any): void {
    this.selectedCategory = parent;
    this.formMode = 'add-subcategory';
  }

  refresh(): void {
    console.log('Refresh categories');
  }

  resetCategories(): void {
    const confirmed = window.confirm(
      'Reset all categories to default? This will remove all current categories.'
    );
    if (!confirmed) {
      return;
    }
    this.categories = structuredClone(this.defaultCategories);
    this.formMode = null;
    this.selectedCategory = null;
  }

  saveCategory(category: any): void {
    console.log('Save', category);
  }

  deleteCategory(category: any): void {
    const confirmed = window.confirm(
      `Delete "${category.name}"?`
    );
    if (!confirmed) {
      return;
    }
    console.log('Delete', category);
  }

  setContextCategory(category: any): void {
    this.contextCategory = category;
  }

  getAllCategories(): any[] {
    const result: any[] = [];

    const traverse = (items: any[]) => {
      for (const item of items) {
        result.push(item);
        if (item.children?.length) {
          traverse(item.children);
        }
      }
    };
    traverse(this.categories);
    return result;
  }
}