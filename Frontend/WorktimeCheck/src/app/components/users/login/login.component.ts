import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/User/user.service';
import { AuthDto } from '../../../models/authDto';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorizedDto } from '../../../models/authorizedDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService:ToastrService = inject(ToastrService);

  auth: AuthDto = {
    userName: '',
    password: ''
  };

  onSubmit() {
    this.userService.login(this.auth).subscribe({
      next: (authorized: AuthorizedDto) => {
        localStorage.setItem('token', authorized.token);
        localStorage.setItem('userId', authorized.userId.toString());
        localStorage.setItem('role', authorized.role)
        this.toastService.success('Login exitoso');
        this.router.navigate(['/employeeList']); // ✅ redirige al listado de empleados
      },
      error: (err) => {
        this.toastService.error('Error de autenticación: ' + err.error);
        console.error(err);
      }
    });
  }
  redirectRegister() {
    this.router.navigate(['register']);
  }
}