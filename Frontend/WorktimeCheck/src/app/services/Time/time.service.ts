import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeTime } from '../../models/employeeTime';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private apiUrl: string = 'http://localhost:8080/time';
  private http = inject(HttpClient);

  /** 🔐 Devuelve headers con el token de JWT */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Id': userId ?? '', // custom header
    });
  }

  getPagedEmployeeTimes(employeeId: number, page: number = 0, size: number = 10) : Observable<PaginatedResponse<EmployeeTime>> {
    const headers = this.getAuthHeaders();
    const params = {
      employeeId: employeeId.toString(),
      page: page.toString(),
      size: size.toString(),
    };
    return this.http.get<any>(`${this.apiUrl}/paged`, { headers, params });
  }

  getEmployeeTimeById(timeId: number): Observable<EmployeeTime> {
    const headers = this.getAuthHeaders();
    return this.http.get<EmployeeTime>(`${this.apiUrl}/${timeId}`, { headers });
  }

  getPagedEmployeeTimesByUserId(page: number = 0, size: number = 10) : Observable<PaginatedResponse<EmployeeTime>> {
    const headers = this.getAuthHeaders();
    const params = {
      page: page.toString(),
      size: size.toString(),
    };
    return this.http.get<any>(`${this.apiUrl}/paged/my`, { headers, params });
  }
}