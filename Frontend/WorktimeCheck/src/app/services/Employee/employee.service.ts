import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../../models/employee';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl: string = 'http://localhost:8080/employees';
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

  createEmployee(employee: Employee): Observable<Employee> {
    console.log(employee);
    return this.http.post<Employee>(this.apiUrl, employee, {
      headers: this.getAuthHeaders(),
    });
  }

  getEmployees(
    size: number,
    page: number,
    search?: string
  ): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Employee>>(`${this.apiUrl}/paged`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }


  updateEmployee(employee: Employee, changeSchedules: boolean = false): Observable<Employee> {
  const url = `${this.apiUrl}/${employee.employeeId}/${changeSchedules}`;
  return this.http.put<Employee>(url, employee, {
    headers : this.getAuthHeaders()
  });
}

  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllEmployees():Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    })
  }
}
