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
  imports: [...SharedModules],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnChanges {
  private fb = inject(FormBuilder);

  // ================= INPUTS =================
  @Input() mode: CategoryFormMode = 'create';
  @Input() category: any = null;
  @Input() parentCategories: any[] = [];

  // ================= OUTPUTS =================
  @Output() saveCategory = new EventEmitter<any>();
  @Output() deleteCategory = new EventEmitter<any>();

  // ================= FORM =================
  form = this.fb.group({
    name: ['', Validators.required],
    type: ['category', Validators.required],
    parentId: [null],
    description: [''],
  });

  // ================= LIFECYCLE =================
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['category'] || changes['parentCategories']) {
      this.configureForm();
    }
  }

  // ================= FORM CONFIG =================
  private configureForm(): void {
    const isCreate = this.mode === 'create';
    const isSub = this.mode === 'add-subcategory';
    const isEdit = this.mode === 'edit';
    const isView = this.mode === 'view';
    const hasParents = this.hasParentCategories;

    if (isCreate) {
      this.form.reset({
        name: '',
        type: hasParents ? 'category' : 'category',
        parentId: null,
        description: '',
      });
      this.form.enable();
      if (!hasParents) {
        this.form.get('type')?.setValue('category');
        this.form.get('type')?.disable({ emitEvent: false });
      }
    }

    if (isSub) {
      this.form.reset({
        name: '',
        type: hasParents ? 'subcategory' : 'category',
        parentId: this.category?.id ?? null,
        description: '',
      });
      this.form.enable();
      if (!hasParents) {
        this.form.get('type')?.setValue('category');
        this.form.get('parentId')?.setValue(null);
      }
    }

    if (isEdit || isView) {
      if (this.category) {
        this.form.patchValue({
          name: this.category.name,
          type: this.category.parentId ? 'subcategory' : 'category',
          parentId: this.category.parentId ?? null,
          description: this.category.description ?? '',
        });
      }
      isView ? this.form.disable() : this.form.enable();
    }
  }

  // ================= ACTIONS =================
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

  // ================= UI HELPERS =================
  get isCreateMode(): boolean {
    return this.mode === 'create' || this.mode === 'add-subcategory';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get hasParentCategories(): boolean {
    return this.parentCategories && this.parentCategories.length > 0;
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

  get showParentField(): boolean {
    return this.form.get('type')?.value === 'subcategory';
  }
}