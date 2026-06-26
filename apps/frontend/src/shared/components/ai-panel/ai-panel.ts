import { Component, computed, inject, signal } from '@angular/core';
import { SharedModules } from '../../shared.module';
import { CoreLayoutApi } from '../../services/core-layout-api';
import { MatMenuModule } from '@angular/material/menu';
import { AiPanelApi, ChatMessage } from '../../services/ai-panel-api';
import { MarkdownPipe } from '../../pipe/markdown-pipe';

@Component({
  selector: 'app-ai-panel',
  imports: [MarkdownPipe, MatMenuModule, ...SharedModules],
  templateUrl: './ai-panel.html',
  styleUrl: './ai-panel.scss',
})
export class AiPanel {
  private coreLayoutService = inject(CoreLayoutApi);
  private aiApiService = inject(AiPanelApi);

  // Computed evaluation prevents unnecessary change detection cycles
  public isPromptEmpty = computed(() => !this.currentPrompt().trim());
  public isWaitingForResponse = signal(false);
  public currentPrompt = signal('');

  // Conversational array state container initialized with a system baseline greet
  public chatHistory = signal<ChatMessage[]>([
    {
      id: 'system-initial-greet',
      role: 'assistant',
      content: 'How can your financial copilot assist you today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  public closePanel(): void {
    this.coreLayoutService.toggleRightPanel();
  }

  public sendPrompt(): void {
    const promptToSend = this.currentPrompt().trim();
    if (!promptToSend || this.isWaitingForResponse()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString(),
    };
    this.chatHistory.update((history) => [...history, userMessage]);
    this.isWaitingForResponse.set(true);
    this.currentPrompt.set(''); // Instantly wipe visual canvas trace

    this.aiApiService.sendPrompt(promptToSend).subscribe({
      next: (backendData) => {
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: backendData.response,
          timestamp: backendData.timestamp,
        };

        this.chatHistory.update((history) => [...history, aiMessage]);
        this.isWaitingForResponse.set(false);
      },
      error: () => {
        // Recovery loop: Handle UI notification adjustments here
        this.isWaitingForResponse.set(false);
      },
    });
  }

  // --- Session Dropdown Menu Integrations ---
  public onNewChat(): void {
    this.aiApiService.initializeNewSession();
    this.chatHistory.set([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Started a clean conversational session. How can I help you?',
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  public onDeleteChat(): void {
    this.aiApiService.clearActiveSession();
    this.chatHistory.set([]);
  }


  public onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.currentPrompt.set(target.value);
  }

  public onKeyDown(event: KeyboardEvent): void {
    // If user presses enter without holding shift, execution triggers
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Stop native line-break addition
      this.sendPrompt();
    }
  }
  
  public onResizeStart(event: PointerEvent): void {
    event.preventDefault();
    this.coreLayoutService.isResizing.set(true);
    
    const startX = event.clientX;
    const startWidth = this.coreLayoutService.aiPanelWidth();

    const onPointerMove = (moveEvent: PointerEvent) => {
      // Since panel is on the right side, moving mouse left reduces clientX, which increases width
      const deltaX = moveEvent.clientX - startX;
      const computedWidth = startWidth - deltaX;
      
      // Establish boundary constraints (e.g., min 280px, max 800px)
      const boundedWidth = Math.max(17.5, Math.min(50, computedWidth));
      
      this.coreLayoutService.aiPanelWidth.set(boundedWidth);
    };

    const onPointerUp = () => {
      this.coreLayoutService.isResizing.set(false);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    // Attach listener globally to capture movement outside the panel track safely
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  public useExamplePrompt(promptText: string): void {
    if (this.isWaitingForResponse()) return;
    // Set the state signal string
    this.currentPrompt.set(promptText);
    // Auto-fire the pipeline instantly for a smooth, single-click demo
    this.sendPrompt();
  }

  public onSearchChat(): void {
    console.log('Opening chat session search overlay...');
    // Future integration: flip a local boolean flag to show a search bar in the body
  }

}
