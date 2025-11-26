import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/User/user.service';
import { AuthDto } from '../../../models/authDto';
import { FormsModule } from '@angular/forms';
import { AuthorizedDto } from '../../../models/authorizedDto';
import { toast } from 'ngx-sonner';

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
        toast.success('Login exitoso');
        this.router.navigate(['/timeList/my']);
      },
      error: (err) => {
        toast.error('Error de autenticación: ' + err.error);
        console.error(err);
      }
    });
  }
  redirectRegister() {
    this.router.navigate(['register']);
  }
}