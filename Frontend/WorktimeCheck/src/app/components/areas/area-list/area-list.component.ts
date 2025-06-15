import { Component, inject, OnInit } from '@angular/core';
import { Area } from '../../../models/area';
import { Employee } from '../../../models/employee';
import { AreaService } from '../../../services/Area/area.service';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-area-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.css'
})
export class AreaListComponent implements OnInit{
  areaList:Area[] = [];
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
    areaResponsible: null as number | null
  };

  private areaService: AreaService = inject(AreaService);
  private employeeService: EmployeeService = inject(EmployeeService);
  
  ngOnInit(): void {
    this.fetchAreas();
    this.loadEmployees();
  }

  fetchAreas(){
    this.areaService.getAreasPaged(this.size, this.page).subscribe(response => {
      this.areaList = response.content;
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
    })
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (err: any) => {
        console.error('Error loading employees:', err);
      }
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
      areaResponsible: area.areaResponsible
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
      areaResponsible: null
    };
  }

  saveArea() {
    if (this.newArea.description.trim() && this.newArea.areaResponsible !== null) {
      if (this.isEditMode && this.editingAreaId !== null) {
        // Update existing area
        const areaToUpdate: Area = {
          id: this.editingAreaId,
          description: this.newArea.description,
          areaResponsible: this.newArea.areaResponsible,
          state: 1 // Maintain current state or get from original area
        };

        this.areaService.updateArea(areaToUpdate).subscribe({
          next: () => {
            this.fetchAreas();
            this.closeAddModal();
            // Add success toast here if you have toast service
          },
          error: (err) => {
            console.error('Error updating area:', err);
            // Add error toast here if you have toast service
          }
        });
      } else {
        // Create new area
        const areaToCreate: Area = {
          id: 0, // Usually set by backend
          description: this.newArea.description,
          areaResponsible: this.newArea.areaResponsible,
          state: 1 // Default to active state
        };

        this.areaService.createArea(areaToCreate).subscribe({
          next: () => {
            this.fetchAreas();
            this.closeAddModal();
            // Add success toast here if you have toast service
          },
          error: (err) => {
            console.error('Error creating area:', err);
            // Add error toast here if you have toast service
          }
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
        },
        error: err => {
          console.error(err);
          //this.toastService.error("Error al borrar el empleado", err.error);
          this.resetDeleteModal();
        }
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
    const areaToEdit = this.areaList.find(area => area.id === areaId);
    if (areaToEdit) {
      this.openEditModal(areaToEdit);
    }
  }
}