import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { StorageApi } from './storage-api';
import { Observable, tap } from 'rxjs';


export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface AiPromptRequest {
  sessionId: string;
  prompt: string;
}

export interface AiPromptResponse {
  sessionId: string;
  response: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiPanelApi {
  private readonly api = inject(ApiService);
  private readonly storageService = inject(StorageApi);
  private readonly STORAGE_SESSION_KEY = 'core_layout_ai_session_id';

  private _currentSessionId = signal<string | null>(
    this.storageService.getItem<string>(this.STORAGE_SESSION_KEY)
  );
  public currentSessionId = computed(() => this._currentSessionId());

  
  // Dispatches the user's prompt down to the backend infrastructure pipeline.
  // Automatically provisions or binds the request to the active session ID tracking token. 
  public sendPrompt(prompt: string): Observable<AiPromptResponse> {
    // Lazy-provision a thread session tracking token if one doesn't exist
    let sessionId = this._currentSessionId();
    if (!sessionId) {
      sessionId = this.initializeNewSession();
    }

    const payload: AiPromptRequest = {
      sessionId,
      prompt: prompt.trim(),
    };

    return this.api.post<AiPromptResponse>(`/ai/prompt`, payload).pipe(
      tap({
        next: (response) => {
          // If the backend forces a session rotation or mapping shift, ensure we persist it
          if (response.sessionId && response.sessionId !== sessionId) {
            this.updateSessionTrack(response.sessionId);
          }
        },
        error: (err) => {
          console.error('Failed executing layout prompt dispatch pipeline:', err);
        }
      })
    );
  }

  // Rotates or generates a brand-new distinct conversational track baseline.
  public initializeNewSession(): string {
    // Generate a quick local tracking client UUID v4 placeholder
    const fallbackUuid = crypto.randomUUID();
    this.updateSessionTrack(fallbackUuid);
    return fallbackUuid;
  }


  // Completely clears out local session references from storage and state.
  public clearActiveSession(): void {
    this.storageService.removeItem(this.STORAGE_SESSION_KEY);
    this._currentSessionId.set(null);
  }

  
  // Internal wrapper orchestrating state rotation updates safely
  private updateSessionTrack(id: string): void {
    this.storageService.setItem(this.STORAGE_SESSION_KEY, id);
    this._currentSessionId.set(id);
  }

}
