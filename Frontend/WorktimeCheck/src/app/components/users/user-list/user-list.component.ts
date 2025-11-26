import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/User/user.service';
import { UserInfoDto } from '../../../models/userInfoDto';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userList: UserInfoDto[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  nameFilter: string = '';
  size: number = 10;
  page: number = 0;

  showConfirmModal: boolean = false;
  userMailToDelete: string | null = null;

  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers(this.size, this.page, this.nameFilter).subscribe(response => {
      this.userList = response.content;
      this.totalPages = response.totalPages;
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
    });
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.fetchUsers();
  }

  previousPage() {
    if (this.page > 0) {
      this.page--;
      this.fetchUsers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchUsers();
    }
  }

  deleteUser(userEmail: string) {
    this.userMailToDelete = userEmail;
    this.showConfirmModal = true;
  }

  confirmDelete() {
    if (this.userMailToDelete !== null) {
      this.userService.deleteUser(this.userMailToDelete).subscribe({
        next: () => {
          toast.success("Usuario anulado con exito");
          this.fetchUsers();
          this.resetModal();
        },
        error: err => {
          console.error(err);
          toast.error("Error al borrar el usuario", err.error);
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
    this.userMailToDelete = null;
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

    // Excel Export Methods
  exportToExcel() {
    this.exportCurrentPage();
  }

  private exportCurrentPage() {
    if (this.userList.length === 0) {
      toast.error('No hay usuarios para exportar');
      return;
    }

    const exportData = this.prepareExportData(this.userList);
    this.generateExcelFile(exportData, 'usuarios_pagina_actual');
  }

  private prepareExportData(users: UserInfoDto[]) {
    return users.map(user => ({
      'Nombre': user.userName,
      'Email': user.email,
      'Rol': user.userRole,
      'Estado': this.getCheckStateText(user.userState),
    }));
  }

  private generateExcelFile(data: any[], filename: string) {
    try {
      // Create workbook and worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Set column widths for better formatting
      const wscols = [
        { width: 25 }, // Nombre
        { width: 30 }, // Email
        { width: 20 }, // Rol
        { width: 12 } // Estado
      ];
      ws['!cols'] = wscols;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

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
