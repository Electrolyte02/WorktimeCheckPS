import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Subject, debounceTime } from 'rxjs';
import * as XLSX from 'xlsx';

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
  private nameFilterSubject = new Subject<string>();

  size: number = 10;
  page: number = 0;

  employeeService: EmployeeService = inject(EmployeeService);

  ngOnInit(): void {
  this.userRole = localStorage.getItem('role');
  this.fetchEmployees();

  this.nameFilterSubject.pipe(
    debounceTime(1500) // 1.5 seconds
  ).subscribe((value: string) => {
    this.nameFilter = value;
    this.fetchEmployees();
  });
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
        toast.success("Empleado borrado exitosamente");
        this.fetchEmployees();
        this.resetModal();
      },
      error: err => {
        console.error(err);
        toast.error("Error al borrar el empleado", err.error);
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
onNameFilterChange(value: string) {
  this.nameFilterSubject.next(value);
}

  getStateClass(state: number): string {
    switch (state) {
      case 0:
        return 'state-deleted';
      case 1:
        return 'state-approved';
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
      default:
        return 'Desconocido';
    }
  }

  exportToExcel() {
    this.exportCurrentPage();
  }

  private exportCurrentPage() {
    if (this.employeeList.length === 0) {
      toast.error('No hay empleados para exportar');
      return;
    }

    const exportData = this.prepareExportData(this.employeeList);
    this.generateExcelFile(exportData, 'empleados_pagina_actual');
  }

   private prepareExportData(employees: Employee[]) {
    return employees.map(emp => ({
      'Nombre Completo': `${emp.employeeName} ${emp.employeeLastName}`,
      'Documento': emp.employeeDocument,
      'Email': emp.employeeEmail,
      'Área': emp.employeeArea.description,
      'Estado': this.getCheckStateText(emp.employeeState),
      'Fecha de Exportación': new Date().toLocaleDateString('es-ES')
    }));
  }

  private generateExcelFile(data: any[], filename: string) {
    try {
      // Create workbook and worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Set column widths for better formatting
      const wscols = [
        { width: 25 }, // Nombre Completo
        { width: 15 }, // Documento
        { width: 30 }, // Email
        { width: 20 }, // Área
        { width: 12 }, // Estado
        { width: 18 }  // Fecha de Exportación
      ];
      ws['!cols'] = wscols;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Empleados');

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
