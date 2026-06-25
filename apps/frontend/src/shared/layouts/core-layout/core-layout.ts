import { Component, inject } from '@angular/core';
import { LeftSidebar } from '../../components/left-sidebar/left-sidebar';
import { SharedModules } from '../../shared.module';
import { CoreLayoutApi } from '../../services/core-layout-api';
import { TransactionPage } from '../../../app/features/transactions/transaction-page/transaction-page';

@Component({
  selector: 'app-core-layout',
  imports: [LeftSidebar,...SharedModules],
  templateUrl: './core-layout.html',
  styleUrl: './core-layout.scss',
})
export class CoreLayout {
  private coreLayoutService = inject(CoreLayoutApi);

  public headerMessage = this.coreLayoutService.headerMessage;
  public isSidebarCollapsed = this.coreLayoutService.isSidebarCollapsed;
  public isAiPanelOpen = this.coreLayoutService.isAiPanelOpen;
  
  public toggleSidebar(): void { this.coreLayoutService.toggleSidebar(); }
  public toggleRightPanel(): void { this.coreLayoutService.toggleRightPanel(); }
  public onAskAI(): void { this.coreLayoutService.isAiPanelOpen.set(true); }
  public onQuickAdd(): void {
    this.coreLayoutService.openTransactionDialog("add");
    // Future expansion: open a dialog pane or launch an overlay menu here
  }
}
