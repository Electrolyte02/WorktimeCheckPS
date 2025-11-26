import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CheckService, Check } from '../../../services/Check/check.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

// Interface for the paginated response
interface CheckPageResponse {
  content: Check[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-check-list',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './check-list.component.html',
  styleUrl: './check-list.component.css'
})
export class CheckListComponent implements OnInit {
  checkList: Check[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  employeeId: number = 0;
  
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  size: number = 10;
  page: number = 0;

  checkService: CheckService = inject(CheckService);

  ngOnInit(): void {
    // Get employee ID from route parameters
    this.route.params.subscribe(params => {
      this.employeeId = +params['employeeId']; // Convert to number
      if (this.employeeId) {
        this.fetchChecks();
      }
    });
  }

  fetchChecks() {
    this.checkService.getChecksPagedByEmployee(this.size, this.page, this.employeeId).subscribe({
      next: (response: CheckPageResponse) => {
        this.checkList = response.content;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      error: (err: any) => {
        console.error('Error fetching checks:', err);
        toast.error('Error al cargar las verificaciones');
      }
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchChecks();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchChecks();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchChecks();
    }
  }

  viewCheckDetails(checkId: number) {
    this.router.navigate(['/check', checkId]);
  }

  goBackToEmployees() {
    this.router.navigate(['/employees']);
  }

  getApprovalText(approval: boolean): string {
    return approval ? 'Aprobado' : 'Rechazado';
  }

  getStateText(state: number): string {
    switch (state) {
      case 0: return 'Inactivo';
      case 1: return 'Activo';
      default: return 'Desconocido';
    }
  }
}