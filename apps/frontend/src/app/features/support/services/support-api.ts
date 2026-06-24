import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api-service';
import { Observable } from 'rxjs';

export interface supportPayload { subject: string; message: string }

@Injectable({
  providedIn: 'root',
})
export class SupportApi {
  private readonly api = inject(ApiService);

  public submitTicket(payload: supportPayload): Observable<any> {
    return this.api.post('/support/ticket', payload);
  }
}
