import { Component, inject, OnInit } from '@angular/core';
import { TimeService } from '../../../services/Time/time.service';
import { EmployeeTime } from '../../../models/employeeTime';
import { Router } from '@angular/router';
import { PaginatedResponse } from '../../../models/paginatedResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';

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
      return employeeTimes.map(time => ({
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
