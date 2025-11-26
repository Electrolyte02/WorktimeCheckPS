import { Component, inject, OnInit } from '@angular/core';
import { TimeService } from '../../../services/Time/time.service';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { EmployeeTime } from '../../../models/employeeTime';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Employee } from '../../../models/employee';
import { EmployeeService } from '../../../services/Employee/employee.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-time-list',
  templateUrl: './time-list.component.html',
  styleUrls: ['./time-list.component.css'],
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule]
})
export class TimeListComponent implements OnInit {
  employeeTimes: EmployeeTime[] = [];
  employees:Employee[] = [];
  size: number = 10;
  page: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  employeeId: number| null = 0;

  private timeService: TimeService = inject(TimeService);
  private route:Router = inject(Router);
  private router: ActivatedRoute = inject(ActivatedRoute);
  private employeeService: EmployeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.employeeId = null;
    this.router.params.subscribe(params => 
      this.employeeId=params['id']
    )
    this.loadEmployees();
    this.loadTimes();
  }

  loadTimes() {
    this.timeService.getPagedEmployeeTimes(this.employeeId, this.page, this.size).subscribe({
      next: (res: PaginatedResponse<EmployeeTime>) => {
        this.employeeTimes = res.content;
        this.totalPages = res.totalPages;
        this.page = res.number;
      },
      error: (err: any) => {
        toast.error('Error al obtener los ingresos/egresos', err.error);
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

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (err: any) => {
        toast.error('Error al cargar las areas:', err);
      }
    });
  }

  getStateClass(state: number): string {
    switch (state) {
      case 0:
        return 'state-deleted';
      case 1:
        return 'state-approved';
      case 2:
        return 'state-pending';
      default:
        return 'state-unknown';
    }
  }

  getCheckStateText(state: number): string {
    switch (state) {
      case 0:
        return 'Inactivo';
      case 1:
        return 'Activo';
      case 2:
        return 'Justificado';
      default:
        return 'Desconocido';
    }
  }

  exportToExcel() {
    this.exportCurrentPage();
  }

   private exportCurrentPage() {
    if (this.employeeTimes.length === 0) {
      toast.error('No hay registros de tiempo para exportar');
      return;
    }

    const exportData = this.prepareExportData(this.employeeTimes);
    this.generateExcelFile(exportData, `tiempos_pagina_actual`);
  }

  private prepareExportData(employeeTimes: EmployeeTime[]) {
    const selectedEmployee = this.employees.find(emp => emp.employeeId === Number(this.employeeId));
    const employeeName = selectedEmployee 
      ? `${selectedEmployee.employeeName} ${selectedEmployee.employeeLastName}`
      : 'Empleado no encontrado';

    return employeeTimes.map(time => ({
      'Empleado': employeeName,
      'Fecha': new Date(time.timeDay).toLocaleDateString('es-ES'),
      'Hora': new Date(time.timeDay).toLocaleTimeString('es-ES'),
      'Tipo de Acción': time.timeType === 'E' ? 'Ingreso' : 'Egreso',
      'A Horario': time.timeOnTime ? 'Sí' : 'No',
      'Estado': this.getCheckStateText(time.timeState)
    }));
  }

  private generateExcelFile(data: any[], filename: string) {
    try {
      // Create workbook and worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Set column widths for better formatting
      const wscols = [
        { width: 25 }, // Empleado
        { width: 12 }, // Fecha
        { width: 10 }, // Hora
        { width: 15 }, // Tipo de Acción
        { width: 12 }, // A Horario
        { width: 15 } // Estado
      ];
      ws['!cols'] = wscols;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Ingresos y Egresos');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fullFilename = `${filename}_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fullFilename);
      
      toast.success(`Excel exportado exitosamente: ${fullFilename}`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      toast.error('Error al generar el archivo Excel');
    }
  }
}
