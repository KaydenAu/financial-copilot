import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SharedModules } from '../../../../../shared/shared.module';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface DashboardWidget {
  id: string;
  title: string;
  size: WidgetSize;
  visible: boolean;
  url: string;
}

const GRID_DIMENSIONS_MAP: Record<WidgetSize, { cols: number; rows: number }> = {
  small: { cols: 1, rows: 1 },   // KPI Matrix View
  medium: { cols: 2, rows: 2 },  // Chart Visualization View
  large: { cols: 3, rows: 2 }    // Full Comprehensive Analytics View
};

@Component({
  selector: 'app-dashboard-page',
  imports: [DragDropModule, MatMenuModule, ...SharedModules],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {

  private readonly DEFAULT_LAYOUT: DashboardWidget[] = [
    { id: 'income_summary', title: 'Income Summary', size: 'small', visible: true, url:'/transactions' },
    { id: 'expense_summary', title: 'Expense Summary', size: 'small', visible: true, url:'/transactions' },
    { id: 'savings_goals', title: 'Savings Goals Tracker', size: 'small', visible: true, url:'/savings' },
    { id: 'ai_insights', title: 'Automated AI Insights Engine', size: 'large', visible: true, url:'/dashboard' },
    { id: 'recent_transactions', title: 'Recent Ledger Transactions', size: 'large', visible: true, url:'/transactions' },
    { id: 'spending_categories', title: 'Spending Breakdowns', size: 'large', visible: true , url:'/categories'},
    { id: 'cash_flow', title: 'Cash Flow Monitor', size: 'large', visible: true, url:'/' },
    { id: 'budget_progress', title: 'Budget Progress Tracking', size: 'large', visible: true, url:'/budgets' },
  ];

  public isSaving = signal<boolean>(false);
  public dashboardWidgets = signal<DashboardWidget[]>([...this.DEFAULT_LAYOUT]);

  public activeWidgets = computed(() => this.dashboardWidgets().filter(w => w.visible));
  public hiddenWidgets = computed(() => this.dashboardWidgets().filter(w => !w.visible));

  public getGridDimensions(size: WidgetSize) { return GRID_DIMENSIONS_MAP[size];}

  public handleWidgetReorder(event: CdkDragDrop<DashboardWidget[]>): void {
    const updated = [...this.dashboardWidgets()];
    // Normalize mapping indexes safely around hidden items
    const visibleItems = this.activeWidgets();
    const targetItem = visibleItems[event.previousIndex];
    const destinationItem = visibleItems[event.currentIndex];
    
    const truePrevIdx = updated.findIndex(w => w.id === targetItem.id);
    const trueDestIdx = updated.findIndex(w => w.id === destinationItem.id);

    moveItemInArray(updated, truePrevIdx, trueDestIdx);
    this.dashboardWidgets.set(updated);
  }

  public updateWidgetSize(id: string, newSize: WidgetSize): void {
    this.dashboardWidgets.update(widgets =>
      widgets.map(w => w.id === id ? { ...w, size: newSize } : w)
    );
  }

  public toggleWidgetVisibility(id: string, visible: boolean): void {
    this.dashboardWidgets.update(widgets =>
      widgets.map(w => w.id === id ? { ...w, visible } : w)
    );
  }

  public saveCurrentLayoutState(): void {
    const layoutPayload = this.dashboardWidgets().map((w, index) => ({
      id: w.id,
      size: w.size,
      visible: w.visible,
      order: index
    }));
    
    console.log('Dispatching Configuration State to API Endpoint:', layoutPayload);
    // Execute data persistence actions here: this.http.post('/api/dashboard/layout', { layout: layoutPayload })
  }
  
  public resetLayoutToDefaultState(): void {
    // Deep clone default state references
    this.dashboardWidgets.set(this.DEFAULT_LAYOUT.map(w => ({ ...w })));
  }
}
