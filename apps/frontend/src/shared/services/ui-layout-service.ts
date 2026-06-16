import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthApi } from '../../app/core/auth/services/auth-api';
import { filter } from 'rxjs';
import { APP_NAVIGATION_CONFIG, DEFAULT_HEADER_MESSAGE, PROFILE_NAVIGATION_CONFIG } from '../layouts/core-layout/core-layout.config';

@Injectable({
  providedIn: 'root',
})
export class UiLayoutService {
  private router = inject(Router);
  private authService = inject(AuthApi);

  public currentPath = signal('');
  public isSidebarCollapsed = signal(false);
  public isAiPanelOpen = signal(false);
  
  constructor(){
    // Evaluate pathing conditions on initial load
    this.sanitizeAndSetPath(this.router.url);

    // Stream route tracking throughout the global application lifetime
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.sanitizeAndSetPath(event.urlAfterRedirects || event.url);
    });
  }

  private sanitizeAndSetPath(url: string): void {
    // Strips out query params (e.g. /dashboard?tab=analytics -> /dashboard)
    const sanitizedUrl = url.split('?')[0];
    this.currentPath.set(sanitizedUrl);
  }

  public brandText = computed(() => {
    return this.currentPath().includes('/profile') 
      ? 'Profile Settings' 
      : 'Financial Copilot';
  });

  public navigationMenu = computed(() => {
    return this.currentPath().includes('/profile') 
      ? PROFILE_NAVIGATION_CONFIG 
      : APP_NAVIGATION_CONFIG;
  });

  public headerMessage = computed(() => {
    const activeMenu = this.navigationMenu();
    const url = this.currentPath();
    
    // Look for matching items within the active dictionary setup
    const matchedItem = activeMenu.find(item => item.route === url);
    const fallbackMatch = matchedItem || activeMenu.find(item => url.startsWith(item.route));

    if (fallbackMatch && typeof fallbackMatch.headerMessage === 'function') {
      const liveUsername = this.authService.currentUser()?.username || 'User';
      const compiledHeaderString = fallbackMatch.headerMessage(liveUsername); 
      return compiledHeaderString;
    }
  
    return DEFAULT_HEADER_MESSAGE;
  });

  public toggleSidebar(): void {
    this.isSidebarCollapsed.update((state) => !state);
  }

  public toggleRightPanel(): void {
    this.isAiPanelOpen.update((state) => !state);
  }
}
