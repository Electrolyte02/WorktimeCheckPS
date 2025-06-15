import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../../models/userDto';
import { AuthDto } from '../../models/authDto';
import { PaginatedResponse } from '../../models/paginatedResponse';
import { UserInfoDto } from '../../models/userInfoDto';
import { AuthorizedDto } from '../../models/authorizedDto';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/auth/';
  private http:HttpClient = inject(HttpClient);
  
  /** 🔐 Devuelve headers con el token de JWT y User Id*/
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'X-User-Id': userId ?? '', // custom header
    });
  }
  
  register(user: UserDto): Observable<any> {
    return this.http.post(this.apiUrl + 'signup', user);
  }

  login(auth: AuthDto): Observable<AuthorizedDto> {
    return this.http.post<AuthorizedDto>(this.apiUrl + 'login', auth);
  }

  getUsers(
    size: number,
    page: number,
    search?: string
  ): Observable<PaginatedResponse<UserInfoDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<UserInfoDto>>(`${this.apiUrl}paged`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(userMail:string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}${userMail}`, {
      headers: this.getAuthHeaders(),
    });
  }

  
}
