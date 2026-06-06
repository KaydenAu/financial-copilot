import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

// Interface to structure our storage event payload
export interface StorageChangeEvent {
  key: string;
  value: any;
}

@Injectable({
  providedIn: 'root',
})
export class StorageApi {
  // Direct internal event bus for publishing and observing changes
  private storageChange$ = new Subject<StorageChangeEvent>();
  
  // Securely saves data to localStorage and publishes the event locally
  public setItem(key: string, value: any): void {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    this.storageChange$.next({ key, value });
  }
  
  // Retrieves items from localStorage with automated JSON parsing fallback
  public getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      // Attempt to parse back into an object / array / boolean / number
      return JSON.parse(data) as T;
    } catch {
      // If it's a plain raw string, return it directly
      return data as unknown as T;
    }
  }

  // Destroys an individual key from storage and notifies observers
  public removeItem(key: string): void {
    localStorage.removeItem(key);
    
    // Publish a null event so observers know this data was wiped
    this.storageChange$.next({ key, value: null });
  }

  // Completely clears out localStorage
  public clear(): void {
    localStorage.clear();
    this.storageChange$.next({ key: '__CLEAR_ALL__', value: null });
  }

  // OBSERVE EVENT: Allows components to stream changes for a SPECIFIC key reactively
  public observeKey<T>(targetKey: string): Observable<T | null> {
    return this.storageChange$.asObservable().pipe(
      // Filter out events that aren't matching our target key
      filter(event => event.key === targetKey || event.key === '__CLEAR_ALL__'),
      // Map it down to return just the clean payload value
      map(event => (event.key === '__CLEAR_ALL__' ? null : (event.value as T)))
    );
  }

  // PUBLISH CUSTOM EVENT: Manually trigger a notification to observers if needed
  public publishCustomEvent(key: string, value: any): void {
    this.storageChange$.next({ key, value });
  }

}
