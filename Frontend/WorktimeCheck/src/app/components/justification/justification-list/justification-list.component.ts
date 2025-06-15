import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JustificationService, EmployeeJustificationDto } from '../../../services/Justification/justification.service';
import { Check } from '../../../models/check';
import { CheckService } from '../../../services/Check/check.service';

@Component({
  selector: 'app-justification-list',
  standalone: true,
  imports: [ NgFor, FormsModule, CommonModule],
  templateUrl: './justification-list.component.html',
  styleUrl: './justification-list.component.css'
})
export class JustificationListComponent implements OnInit {
  justificationList: EmployeeJustificationDto[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  employeeIdFilter: number | null = 1;
  router: Router = inject(Router);

  // Modal properties
  isModalOpen: boolean = false;
  checkDetails: Check | null = null;
  isLoadingCheck: boolean = false;

  size: number = 10;
  page: number = 0;

  justificationService: JustificationService = inject(JustificationService);
  checkService: CheckService = inject(CheckService);

  ngOnInit(): void {
    this.fetchJustifications();
  }

  fetchJustifications() {
    this.justificationService.getJustificationsPaged(
      this.page, 
      this.size, 
      this.employeeIdFilter || undefined
    ).subscribe((response: { content: EmployeeJustificationDto[]; totalPages: number; }) => {
      this.justificationList = response.content;
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchJustifications();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchJustifications();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchJustifications();
    }
  }

  viewJustification(justificationId: number) {
    this.router.navigate(['/justification/view', justificationId]);
  }

  /**
   * Opens modal and loads check details for the given justification
   */
  viewJustificationCheck(justificationId: number) {
    this.isModalOpen = true;
    this.isLoadingCheck = true;
    this.checkDetails = null;

    this.checkService.getByJustificationId(justificationId).subscribe({
      next: (check: Check) => {
        this.checkDetails = check;
        this.isLoadingCheck = false;
      },
      error: (error: any) => {
        console.error('Error loading check details:', error);
        this.isLoadingCheck = false;
      }
    });
  }

  /**
   * Closes the modal and resets check details
   */
  closeModal() {
    this.isModalOpen = false;
    this.checkDetails = null;
    this.isLoadingCheck = false;
  }

  filterByEmployee() {
    this.page = 0; // Reset to first page when filtering
    this.fetchJustifications();
  }

  clearFilter() {
    this.employeeIdFilter = null;
    this.page = 0;
    this.fetchJustifications();
  }

  getStateText(state: number): string {
    switch(state) {
      case 0: return 'Anulada';
      case 1: return 'Pendiente';
      case 2: return 'Aprobada';
      case 3: return 'Rechazada'
      default: return 'Desconocido';
    }
  }

  getStateClass(state: number): string {
    switch(state) {
      case 0: return 'state-deleted';
      case 1: return 'state-pending';
      case 2: return 'state-approved';
      case 3: return 'state-rejected';
      default: return 'state-unknown';
    }
  }

  getCheckStateText(state: number): string {
    switch(state) {
      case 0: return 'Inactivo';
      case 1: return 'Activo';
      default: return 'Desconocido';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Checks if justification has an approved or rejected state (2 or 3)
   */
  hasCheckAvailable(state: number): boolean {
    return state === 2 || state === 3;
  }
}