import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedModules } from '../../../../../shared/shared.module';

export type CategoryFormMode =
  | 'create'
  | 'edit'
  | 'view'
  | 'add-subcategory';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ...SharedModules
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})

export class CategoryForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() mode: CategoryFormMode = 'create';
  @Input() category: any = null;
  @Input() parentCategories: any[] = [];

  @Output() saveCategory = new EventEmitter<any>();
  @Output() deleteCategory = new EventEmitter<any>();

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['category', Validators.required],
    parentId: [null],
    description: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['category']) {
      this.configureForm();
    }
  }

  private configureForm(): void {
    if (this.mode === 'create') {
      this.form.reset({
        name: '',
        type: 'category',
        parentId: null,
        description: '',
      });
      this.form.enable();
    }

    if (this.mode === 'add-subcategory') {
      this.form.reset({
        name: '',
        type: 'subcategory',
        parentId: this.category?.id ?? null,
        description: '',
      });
      this.form.enable();
    }

    if (this.mode === 'edit' || this.mode === 'view') {
      if (this.category) {
        this.form.patchValue({
          name: this.category.name,
          type: this.category.type ?? 'category',
          parentId: this.category.parentId ?? null,
          description: this.category.description ?? '',
        });
      }

      if (this.mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saveCategory.emit({
      ...this.category,
      ...this.form.getRawValue(),
    });
  }

  onDelete(): void {
    this.deleteCategory.emit(this.category);
  }

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Category';
      case 'edit':
        return 'Edit Category';
      case 'view':
        return 'Category Details';
      case 'add-subcategory':
        return 'Create Subcategory';
      default:
        return 'Category';
    }
  }

  get showDeleteButton(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get showParentField(): boolean {
    return this.form.get('type')?.value === 'subcategory';
  }
}