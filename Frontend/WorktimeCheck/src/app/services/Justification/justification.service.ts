import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginatedResponse';

export interface TimeJustificationDto {
  justificationId: number;
  timeId: number;
  justificationObservation: string;
  justificationUrl: string;
  fileContent: string; // Base64 encoded file content
  fileName: string;
  contentType: string;
  fileSize: number;
  timeState: number;
}

@Injectable({
  providedIn: 'root'
})
export class JustificationService {
  private apiUrl = 'http://localhost:8080/justification';
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

  /** 🔐 Headers para requests JSON */
  private getJsonHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No se encontró token JWT');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  sendJustification(formData: FormData): Observable<any> {
    console.log('Token enviado:', localStorage.getItem('token'));
    
    // Para FormData, Angular automáticamente establece:
    // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
    // Solo necesitamos agregar Authorization
    return this.http.post(this.apiUrl, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Método alternativo usando observe para debug completo
  sendJustificationWithDebug(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: this.getAuthHeaders(),
      observe: 'response' // Para ver headers de respuesta también
    });
  }

  // Nuevo método para obtener justificación por ID
  getJustification(justificationId: number): Observable<TimeJustificationDto> {
    return this.http.get<TimeJustificationDto>(`${this.apiUrl}/${justificationId}`, {
      headers: this.getJsonHeaders()
    });
  }

  // Método para crear URL de descarga desde Base64
  createDownloadUrl(fileContent: string, contentType: string, fileName: string): string {
    // Convert Base64 to Blob
    const byteCharacters = atob(fileContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    
    // Create object URL
    return URL.createObjectURL(blob);
  }

  // Método para descargar archivo directamente
  downloadFile(fileContent: string, contentType: string, fileName: string): void {
    const url = this.createDownloadUrl(fileContent, contentType, fileName);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(url);
  }

    getJustificationsPaged(
    page: number = 0, 
    size: number = 10, 
    employeeId: number | null
  ): Observable<PaginatedResponse<EmployeeJustificationDto>> {
    let params: any = {
      page: page.toString(),
      size: size.toString()
    };

    if (employeeId) {
      params.employeeId = employeeId.toString();
    }
    
    console.log(this.apiUrl);
    console.log(params);

    return this.http.get<PaginatedResponse<EmployeeJustificationDto>>(
      `${this.apiUrl}/paged`,
      { params , headers : this.getAuthHeaders()}
    );
  }

  getJustificationsPagedByUser(
    page: number = 0, 
    size: number = 10, 
  ): Observable<PaginatedResponse<EmployeeJustificationDto>> {
    let params: any = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<EmployeeJustificationDto>>(
      `${this.apiUrl}/paged/my`,
      { params , headers : this.getAuthHeaders()}
    );
  }
}

export interface EmployeeJustificationDto {
  justificationId: number;
  employeeFullName: string;
  justificationState: number;
  justificationDate: string; // ISO string format
}