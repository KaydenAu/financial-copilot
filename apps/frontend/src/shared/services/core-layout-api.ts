import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthApi } from '../../app/core/auth/services/auth-api';
import { filter } from 'rxjs';
import { APP_NAVIGATION_CONFIG, DEFAULT_HEADER_MESSAGE, PROFILE_NAVIGATION_CONFIG } from '../layouts/core-layout/core-layout.config';
import { MatDialog } from '@angular/material/dialog';
import { TransactionFormDialog } from '../../app/features/transactions/transaction-form-dialog/transaction-form-dialog';

@Injectable({
  providedIn: 'root',
})
export class CoreLayoutApi {
  private router = inject(Router);
  private authService = inject(AuthApi);
  private dialog = inject(MatDialog);

  public userName = computed(() => {
    const data = this.authService.currentUser(); 
    return data?.user?.userName || data?.userName || 'user_fallback';
  });
  public email = computed(() => {
    const data = this.authService.currentUser();
    return data?.user?.email || data?.email || ''
  });
  
  public firstName = computed(() => this.authService.userProfile().firstName || '');
  public lastName = computed(() => this.authService.userProfile().lastName || '');
  public preferredCurrency = computed(() => this.authService.userProfile().preferredCurrency || 'MYR');
  public timezone = computed(() => this.authService.userProfile().timezone || 'Asia/Kuala_Lumpur');
  public dateFormat = computed(() => this.authService.userProfile().dateFormat || 'DD/MM/YYYY');
  public numberFormat = computed(() => this.authService.userProfile().numberFormat || 'comma-dot');

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
    return this.currentPath().includes('/profile') ? 'Profile Settings' : 'Financial Copilot';
  });

  public navigationMenu = computed(() => {
    return this.currentPath().includes('/profile') ? PROFILE_NAVIGATION_CONFIG : APP_NAVIGATION_CONFIG;
  });

  public headerMessage = computed(() => {
    const url = this.currentPath();
    const activeMenu = this.navigationMenu();
    const liveUserName = this.userName();
    
    // Look for matching items within the active dictionary setup
    const matchedItem = activeMenu.find(item => item.route === url);
    const fallbackMatch = matchedItem || activeMenu.find(item => url.startsWith(item.route));

    if (fallbackMatch && typeof fallbackMatch.headerMessage === 'function') {
      const compiledHeaderString = fallbackMatch.headerMessage(liveUserName); 
      return compiledHeaderString;
    }
  
    return DEFAULT_HEADER_MESSAGE;
  });

  public openTransactionDialog(mode: 'add' | 'edit' = 'add', initialData?: any): void {
    this.dialog.open(TransactionFormDialog, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        mode,
        ...initialData
      },
    });
  }

  public toggleSidebar(): void { this.isSidebarCollapsed.update((state) => !state); }
  public toggleRightPanel(): void { this.isAiPanelOpen.update((state) => !state); }
  public logout(): void { this.authService.logout(); }
}
