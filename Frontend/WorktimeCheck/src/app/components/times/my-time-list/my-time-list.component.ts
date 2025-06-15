import { Component, inject, OnInit } from '@angular/core';
import { TimeService } from '../../../services/Time/time.service';
import { EmployeeTime } from '../../../models/employeeTime';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-time-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-time-list.component.html',
  styleUrl: './my-time-list.component.css'
})
export class MyTimeListComponent implements OnInit{
  employeeTimes: EmployeeTime[] = [];
  size: number = 10;
  page: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  private timeService: TimeService = inject(TimeService);
  private route:Router = inject(Router);
  private toastService:ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadTimes();
  }

  loadTimes() {
    this.timeService.getPagedEmployeeTimesByUserId(this.page, this.size).subscribe({
      next: (res: PaginatedResponse<EmployeeTime>) => {
        this.employeeTimes = res.content;
        this.totalPages = res.totalPages;
        this.page = res.number;
      },
      error: (err: any) => {
        this.toastService.error('Error al obtener los ingresos/egresos', err.error);
        console.error('Error fetching employee times', err);
      }
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.loadTimes();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.loadTimes();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadTimes();
    }
  }

  redirectJustification(timeId: number) {
    this.route.navigate(['/justification', timeId])
  }
}
