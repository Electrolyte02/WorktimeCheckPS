import { Component, inject, OnInit } from '@angular/core';
import { Check } from '../../../models/check';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckPageResponse, CheckService } from '../../../services/Check/check.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-my-check-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './my-check-list.component.html',
  styleUrl: './my-check-list.component.css'
})
export class MyCheckListComponent implements OnInit {
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
    this.fetchChecks();
  }

  fetchChecks() {
    this.checkService.getChecksPagedByUserId(this.size, this.page).subscribe({
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
    this.router.navigate(['/employeeList']);
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
