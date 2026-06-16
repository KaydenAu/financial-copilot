import { Component, inject } from '@angular/core';
import { LeftSidebar } from '../../components/left-sidebar/left-sidebar';
import { SharedModules } from '../../shared.module';
import { UiLayoutService } from '../../services/ui-layout-service';

@Component({
  selector: 'app-core-layout',
  imports: [LeftSidebar, ...SharedModules],
  templateUrl: './core-layout.html',
  styleUrl: './core-layout.scss',
})
export class CoreLayout {
  private uiLayoutService = inject(UiLayoutService);

  public headerMessage = this.uiLayoutService.headerMessage;
  public isSidebarCollapsed = this.uiLayoutService.isSidebarCollapsed;
  public isAiPanelOpen = this.uiLayoutService.isAiPanelOpen;
  
  public toggleSidebar(): void { this.uiLayoutService.toggleSidebar(); }
  public toggleRightPanel(): void { this.uiLayoutService.toggleRightPanel(); }
  public onAskAI(): void { this.uiLayoutService.isAiPanelOpen.set(true); }
}
