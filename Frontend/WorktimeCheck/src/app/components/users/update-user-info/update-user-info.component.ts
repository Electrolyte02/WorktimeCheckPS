import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user-info',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './update-user-info.component.html',
  styleUrl: './update-user-info.component.css'
})
export class UpdateUserInfoComponent implements OnInit{
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  passwordForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    if (confirmPassword.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      
      const userEmail = localStorage.getItem('userEmail'); // Adjust based on how you store user info
      const userName = localStorage.getItem('userName'); // Adjust based on how you store user info
      
      const userDto = {
        userName: userName || '',
        email: userEmail || '',
        password: this.passwordForm.get('newPassword')?.value
      };

      this.userService.updateInfo(userDto).subscribe({
        next: (response) => {
          this.isLoading = false;
          toast.success('Contraseña actualizada exitosamente');
          this.returnBack();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating password:', error);
          toast.error('Error al actualizar la contraseña. Por favor, intente nuevamente.');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
      toast.error('Por favor, complete todos los campos correctamente');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  returnBack(): void {
    this.router.navigate(['/profile']); // Adjust the route as needed
  }
}
