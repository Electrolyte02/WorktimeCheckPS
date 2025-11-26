import { Component, inject, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../services/Notification/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  notificationList: Notification[] = [];
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  size: number = 10;
  page: number = 0;

  // Date filters
  fromDate: string = '';
  toDate: string = '';

  private notificationService: NotificationService = inject(NotificationService);
  
  ngOnInit(): void {
    this.initializeDates();
    this.fetchNotifications();
  }

  private initializeDates(): void {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
    this.fromDate = this.formatDateForInput(sevenDaysAgo);
    this.toDate = this.formatDateForInput(now);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  fetchNotifications(): void {
    if (!this.fromDate || !this.toDate) {
      toast.error('Por favor seleccione las fechas de filtro');
      return;
    }

    // Convert to ISO string format for the API
    const fromISO = new Date(this.fromDate).toISOString();
    const toISO = new Date(this.toDate).toISOString();

    this.notificationService.getNotifications(this.page, this.size, fromISO, toISO).subscribe({
      next: (response) => {
        this.notificationList = response.content;
        this.totalPages = response.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
      },
      error: (err) => {
        toast.error('Error al cargar las notificaciones', err);
      }
    });
  }

  applyFilters(): void {
    this.page = 0; // Reset to first page when applying filters
    this.fetchNotifications();
  }

  // Pagination methods
  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.fetchNotifications();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchNotifications();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchNotifications();
    }
  }

    exportToExcel() {
    this.exportCurrentPage();
  }

  private exportCurrentPage() {
    if (this.notificationList.length === 0) {
      toast.error('No hay notificaciones para exportar');
      return;
    }

    const exportData = this.prepareExportData(this.notificationList);
    this.generateExcelFile(exportData, 'notificaciones_pagina_actual');
  }

  private prepareExportData(notifications: Notification[]) {
    return notifications.map(notification => ({
      'Remitente': notification.notificationSender,
      'Destinatario': notification.notificationReceiver,
      'Asunto': notification.notificationSubject,
      'Estado de Envío': notification.notificationSentStatus ? 'Enviado' : 'No Enviado',
      'Período de Filtro': `${this.formatDateForDisplay(new Date(this.fromDate))} - ${this.formatDateForDisplay(new Date(this.toDate))}`
    }));
  }

  private formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private generateExcelFile(data: any[], filename: string) {
    try {
      // Create workbook and worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Set column widths for better formatting
      const wscols = [
        { width: 30 }, // Remitente
        { width: 30 }, // Destinatario
        { width: 40 }, // Asunto
        { width: 15 }, // Estado de Envío
        { width: 35 } // Período de Filtro
      ];
      ws['!cols'] = wscols;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Notificaciones');

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