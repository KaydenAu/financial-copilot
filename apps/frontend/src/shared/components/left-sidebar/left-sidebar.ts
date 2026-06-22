import { Component, inject, signal } from '@angular/core';
import { SharedModules } from '../../shared.module';
import { APP_NAVIGATION_CONFIG } from '../../layouts/core-layout/core-layout.config';
import { AuthApi } from '../../../app/core/auth/services/auth-api';
import { UiLayoutService } from '../../services/ui-layout-service';

@Component({
  selector: 'app-left-sidebar',
  imports: [...SharedModules],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.scss',
})
export class LeftSidebar {
  private authService = inject(AuthApi);
  private uiLayoutService = inject(UiLayoutService);

  public isCollapsed = this.uiLayoutService.isSidebarCollapsed;
  public navigationItems = this.uiLayoutService.navigationMenu;
  public brandText = this.uiLayoutService.brandText; 
  
  public toggleSidebar(): void {
    this.uiLayoutService.toggleSidebar();
  }
  
  public logout(): void {
    this.authService.logout();
  }

}
