import { Component, inject, OnInit } from '@angular/core';
import { Area } from '../../../models/area';
import { Employee } from '../../../models/employee';
import { AreaService } from '../../../services/Area/area.service';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-area-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.css',
})
export class AreaListComponent implements OnInit {
  areaList: Area[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  size: number = 10;
  page: number = 0;

  // Delete modal
  showConfirmModal: boolean = false;
  areaIdToDelete: number | null = null;

  // Add/Edit area modal
  showAddModal: boolean = false;
  employees: Employee[] = [];
  isEditMode: boolean = false;
  editingAreaId: number | null = null;
  newArea = {
    description: '',
    areaResponsible: null as number | null,
  };

  private areaService: AreaService = inject(AreaService);
  private employeeService: EmployeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.fetchAreas();
    this.loadEmployees();
  }

  fetchAreas() {
    this.areaService
      .getAreasPaged(this.size, this.page)
      .subscribe((response) => {
        this.areaList = response.content;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i
        );
      });
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (err: any) => {
        toast.error('Error al cargar las areas:', err);
      },
    });
  }

  // Add/Edit area modal methods
  openAddModal() {
    this.isEditMode = false;
    this.editingAreaId = null;
    this.showAddModal = true;
    this.resetNewAreaForm();
  }

  openEditModal(area: Area) {
    this.isEditMode = true;
    this.editingAreaId = area.id;
    this.newArea = {
      description: area.description,
      areaResponsible: area.areaResponsible,
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.isEditMode = false;
    this.editingAreaId = null;
    this.resetNewAreaForm();
  }

  private resetNewAreaForm() {
    this.newArea = {
      description: '',
      areaResponsible: null,
    };
  }

  saveArea() {
    if (
      this.newArea.description.trim() &&
      this.newArea.areaResponsible !== null
    ) {
      if (this.isEditMode && this.editingAreaId !== null) {
        // Update existing area
        const areaToUpdate: Area = {
          id: this.editingAreaId,
          description: this.newArea.description,
          areaResponsible: this.newArea.areaResponsible,
          state: 1, // Maintain current state or get from original area
        };

        this.areaService.updateArea(areaToUpdate).subscribe({
          next: () => {
            this.fetchAreas();
            this.closeAddModal();
            toast.success('Area actualizada con exito');
            // Add success toast here if you have toast service
          },
          error: (err) => {
            toast.error('Error actualizando el area:', err);
            // Add error toast here if you have toast service
          },
        });
      } else {
        // Create new area
        const areaToCreate: Area = {
          id: 0, // Usually set by backend
          description: this.newArea.description,
          areaResponsible: this.newArea.areaResponsible,
          state: 1, // Default to active state
        };

        this.areaService.createArea(areaToCreate).subscribe({
          next: () => {
            this.fetchAreas();
            this.closeAddModal();
            toast.success('Exito al crear el area');
            // Add success toast here if you have toast service
          },
          error: (err) => {
            toast.error('Error creando el area:', err);
            // Add error toast here if you have toast service
          },
        });
      }
    }
  }

  // Delete modal methods
  deleteArea(areaId: number) {
    this.areaIdToDelete = areaId;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.resetDeleteModal();
  }

  private resetDeleteModal() {
    this.showConfirmModal = false;
    this.areaIdToDelete = null;
  }

  confirmDelete() {
    if (this.areaIdToDelete !== null) {
      this.areaService.deleteArea(this.areaIdToDelete).subscribe({
        next: () => {
          this.fetchAreas();
          this.resetDeleteModal();
          toast.success('Area anulada con exito');
        },
        error: (err) => {
          toast.error('Error al anular el area', err);
          this.resetDeleteModal();
        },
      });
    }
  }

  // Pagination methods
  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchAreas();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchAreas();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchAreas();
    }
  }

  editArea(areaId: number) {
    const areaToEdit = this.areaList.find((area) => area.id === areaId);
    if (areaToEdit) {
      this.openEditModal(areaToEdit);
    }
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
    if (this.areaList.length === 0) {
      toast.error('No hay áreas para exportar');
      return;
    }

    const exportData = this.prepareExportData(this.areaList);
    this.generateExcelFile(exportData, 'areas_pagina_actual');
  }

  private prepareExportData(areas: Area[]) {
    return areas.map((area) => {
      // Find the responsible employee
      const responsibleEmployee = this.employees.find(
        (emp) => emp.employeeId === area.areaResponsible
      );
      const responsibleName = responsibleEmployee
        ? `${responsibleEmployee.employeeName} ${responsibleEmployee.employeeLastName}`
        : 'No asignado';

      return {
        'ID Área': area.id,
        Descripción: area.description,
        Responsable: responsibleName,
        Estado: this.getCheckStateText(area.state)
      };
    });
  }

  private generateExcelFile(data: any[], filename: string) {
    try {
      // Create workbook and worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Set column widths for better formatting
      const wscols = [
        { width: 10 }, // ID Área
        { width: 30 }, // Descripción
        { width: 25 }, // Responsable
        { width: 12 }, // Estado
      ];
      ws['!cols'] = wscols;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Áreas');

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, '-');
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
