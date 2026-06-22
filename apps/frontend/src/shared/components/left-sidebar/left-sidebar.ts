import { Component, inject } from '@angular/core';
import { SharedModules } from '../../shared.module';
import { CoreLayoutApi } from '../../services/core-layout-api';

@Component({
  selector: 'app-left-sidebar',
  imports: [...SharedModules],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.scss',
})
export class LeftSidebar {
  private coreLayoutService = inject(CoreLayoutApi);

  public isCollapsed = this.coreLayoutService.isSidebarCollapsed;
  public navigationItems = this.coreLayoutService.navigationMenu;
  public brandText = this.coreLayoutService.brandText; 
  
  public toggleSidebar(): void { this.coreLayoutService.toggleSidebar(); }
  public logout(): void { this.coreLayoutService.logout();}
}
