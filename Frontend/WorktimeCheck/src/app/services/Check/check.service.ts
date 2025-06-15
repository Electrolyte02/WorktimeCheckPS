import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Check {
  checkId: number;
  justificationId: number;
  checkApproval: boolean;
  checkReason: string;
  checkState: number;
}

// Interface for paginated response
export interface CheckPageResponse {
  content: Check[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  private apiUrl: string = 'http://localhost:8080/check';
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

  /**
   * Creates a new justification check (approval/rejection)
   * @param check Check object with justification decision
   * @returns Observable with the created check
   */
  createJustificationCheck(check: Omit<Check, 'checkId'>): Observable<Check> {
    return this.http.post<Check>(
      this.apiUrl,
      check,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Gets check details by justification ID
   * @param justificationId ID of the justification
   * @returns Observable with the check details
   */
  getByJustificationId(justificationId: number): Observable<Check> {
    return this.http.get<Check>(
      `${this.apiUrl}/view/${justificationId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Gets paginated checks for a specific employee
   * @param size Number of items per page
   * @param page Page number (0-based)
   * @param employeeId ID of the employee
   * @returns Observable with paginated check results
   */
  getChecksPagedByEmployee(size: number, page: number, employeeId: number): Observable<CheckPageResponse> {
    const params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString())
      .set('employeeId', employeeId.toString());

    return this.http.get<CheckPageResponse>(
      `${this.apiUrl}/paged`,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }

    /**
   * Gets paginated checks for a specific employee
   * @param size Number of items per page
   * @param page Page number (0-based)
   * @param employeeId ID of the employee
   * @returns Observable with paginated check results
   */
  getChecksPagedByUserId(size: number, page: number): Observable<CheckPageResponse> {
    const params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString());

    return this.http.get<CheckPageResponse>(
      `${this.apiUrl}/paged/my`,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }
}