import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/User/user.service';
import { UserDto } from '../../../models/userDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  private router = inject(Router);
  private userService:UserService = inject(UserService);
  private toastService:ToastrService = inject(ToastrService);

  user: UserDto = {
    userName: '',
    email: '',
    password: ''
  };

  onSubmit() {
    this.userService.register(this.user).subscribe({
      next: () => {
        this.toastService.success('Registro exitoso', 'Exito');
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.toastService.error('Error en el registro', err.error)
      }
    });
  }

  redirectLogin() {
    this.router.navigate(['login']);
  }
}
