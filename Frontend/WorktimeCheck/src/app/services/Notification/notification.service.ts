import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/notifications';
  private http: HttpClient = inject(HttpClient);

  /** 🔐 Devuelve headers con el token de JWT - SOLO Authorization */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'X-User-Id': userId ?? '', // custom header
    });
  }

  getNotifications(page: number, size: number, from: string, to: string): Observable<PaginatedResponse<Notification>> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Notification>>(`${this.apiUrl}/paged`, {
      headers: this.getAuthHeaders(),
      params
    });
  }
}

export interface Notification{
  notificationId:number;
  notificationSender:string;
  notificationReceiver:string;
  notificationSubject:string;
  notificationSentStatus:boolean;
}