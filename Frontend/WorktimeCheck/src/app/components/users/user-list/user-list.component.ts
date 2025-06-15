import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { UserInfoDto } from '../../../models/userInfoDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userList: UserInfoDto[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  nameFilter: string = '';
  size: number = 10;
  page: number = 0;

  showConfirmModal: boolean = false;
  userMailToDelete: string | null = null;

  private router = inject(Router);
  private userService = inject(UserService);
  private toastService:ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers(this.size, this.page, this.nameFilter).subscribe(response => {
      this.userList = response.content;
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchUsers();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchUsers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchUsers();
    }
  }

  deleteUser(userEmail: string) {
    this.userMailToDelete = userEmail;
    this.showConfirmModal = true;
  }

  confirmDelete() {
    if (this.userMailToDelete !== null) {
      this.userService.deleteUser(this.userMailToDelete).subscribe({
        next: () => {
          this.fetchUsers();
          this.resetModal();
        },
        error: err => {
          console.error(err);
          this.toastService.error("Error al borrar el usuario", err.error);
          this.resetModal();
        }
      });
    }
  }

  cancelDelete() {
    this.resetModal();
  }

  private resetModal() {
    this.showConfirmModal = false;
    this.userMailToDelete = null;
  }
}
