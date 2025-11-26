import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/User/user.service';
import { UserDto } from '../../../models/userDto';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  private router = inject(Router);
  private userService: UserService = inject(UserService);

  user: UserDto = {
    userName: '',
    email: '',
    password: ''
  };

  // Variables separadas para los checkboxes (solo frontend)
  termsAccepted = false;
  privacyAccepted = false;
  
  showTermsModal = false;
  showPrivacyModal = false;

  onSubmit(form: NgForm) {
    // Solo enviar si el formulario es válido
    if (form.valid) {
      this.userService.register(this.user).subscribe({
        next: () => {
          toast.success('Registro exitoso');
          this.router.navigate(['login']);
        },
        error: (err) => {
          toast.error('Error en el registro');
          console.error(err);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  redirectLogin() {
    this.router.navigate(['login']);
  }

  openTermsModal() {
    this.showTermsModal = true;
  }

  closeTermsModal() {
    this.showTermsModal = false;
  }

  openPrivacyModal() {
    this.showPrivacyModal = true;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }
}