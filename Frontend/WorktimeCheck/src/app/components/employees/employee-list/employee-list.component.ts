import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, NgFor, FormsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employeeList: Employee[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  nameFilter: string = '';
  router: Router = inject(Router);
  userRole:string | null = "";

  size: number = 10;
  page: number = 0;

  employeeService: EmployeeService = inject(EmployeeService);
  private toastService:ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeeService.getEmployees(this.size, this.page, this.nameFilter).subscribe(response => {
      this.employeeList = response.content;
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchEmployees();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchEmployees();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchEmployees();
    }
  }

  deleteEmployee(employeeId: number) {
    this.employeeIdToDelete = employeeId;
    this.showConfirmModal = true;
  }

  editEmployee(employeeId: number) {
    this.router.navigate(['/employee', employeeId]);
  }

  showConfirmModal: boolean = false;
  employeeIdToDelete: number | null = null;

confirmDelete() {
  if (this.employeeIdToDelete !== null) {
    this.employeeService.deleteEmployee(this.employeeIdToDelete).subscribe({
      next: () => {
        this.fetchEmployees();
        this.resetModal();
      },
      error: err => {
        console.error(err);
        this.toastService.error("Error al borrar el empleado", err.error);
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
  this.employeeIdToDelete = null;
}

}
