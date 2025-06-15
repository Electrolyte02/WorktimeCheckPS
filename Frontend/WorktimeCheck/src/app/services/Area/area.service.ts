import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area } from '../../models/area';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private apiUrl: string = 'http://localhost:8080/areas';
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

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area, {
      headers: this.getAuthHeaders(),
    });
  }

  updateArea(area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${area.id}`, area, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteArea(areaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${areaId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAreasPaged(
    size:number,
    page:number
  ) : Observable<PaginatedResponse<Area>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

      return this.http.get<PaginatedResponse<Area>>(`${this.apiUrl}/paged`, {
        params,
        headers: this.getAuthHeaders()
      })
  }
}
