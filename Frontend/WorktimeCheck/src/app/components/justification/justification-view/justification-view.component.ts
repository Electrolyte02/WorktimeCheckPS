import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JustificationService, TimeJustificationDto } from '../../../services/Justification/justification.service';


@Component({
  selector: 'app-justification-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, FormsModule],
  templateUrl: './justification-view.component.html',
  styleUrl: './justification-view.component.css'
})
export class JustificationViewComponent implements OnInit, OnDestroy {
  @Input() selectedDate!: string;
  justificationId: number = 0; // Will be set from route parameter
  
  // Optional: keep these as inputs if you want to pass data directly
  @Input() justificationObservation?: string;
  @Input() downloadUrl?: string | null;

  justificationForm!: FormGroup;
  justificationData?: TimeJustificationDto;
  fileDownloadUrl?: string;
  isLoading = false;
  error?: string;

  private fb: FormBuilder = inject(FormBuilder);
  private justificationService: JustificationService = inject(JustificationService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeForm();
    this.getJustificationIdFromRoute();
  }

  ngOnDestroy(): void {
    // Clean up object URL to prevent memory leaks
    if (this.fileDownloadUrl) {
      URL.revokeObjectURL(this.fileDownloadUrl);
    }
  }

  private getJustificationIdFromRoute(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && !isNaN(Number(id))) {
      this.justificationId = Number(id);
      this.loadJustificationData();
    } else {
      // Handle invalid or missing ID
      this.error = 'ID de justificación inválido';
      console.error('Invalid justification ID from route:', id);
    }
  }

  private initializeForm(): void {
    this.justificationForm = this.fb.group({
      justificationObservation: [{ value: '', disabled: true }] // Read-only form
    });
  }

  loadJustificationData(): void {
    if (!this.justificationId) {
      this.error = 'ID de justificación no válido';
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    this.justificationService.getJustification(this.justificationId).subscribe({
      next: (data: TimeJustificationDto) => {
        console.log(data);
        this.justificationData = data;
        this.updateFormWithData(data);
        this.createFileDownloadUrl(data);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading justification:', error);
        this.error = 'Error al cargar la justificación';
        this.isLoading = false;
      }
    });
  }

  private updateFormWithData(data: TimeJustificationDto): void {
    console.log(data);
    this.justificationForm.patchValue({
      justificationObservation: data.justificationObservation
    });
  }

  private createFileDownloadUrl(data: TimeJustificationDto): void {
    if (data.fileContent && data.contentType && data.fileName) {
      // Clean up previous URL if exists
      if (this.fileDownloadUrl) {
        URL.revokeObjectURL(this.fileDownloadUrl);
      }
      
      this.fileDownloadUrl = this.justificationService.createDownloadUrl(
        data.fileContent,
        data.contentType,
        data.fileName
      );
    }
  }

  // Method to handle file download
  downloadFile(): void {
    if (this.justificationData?.fileContent && this.justificationData?.contentType && this.justificationData?.fileName) {
      this.justificationService.downloadFile(
        this.justificationData.fileContent,
        this.justificationData.contentType,
        this.justificationData.fileName
      );
    }
  }

  // Method to get file size in human readable format
  getFileSize(): string {
    if (!this.justificationData?.fileSize) return '';
    
    const bytes = this.justificationData.fileSize;
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Method to check if file is an image for preview
  isImageFile(): boolean {
    return this.justificationData?.contentType?.startsWith('image/') || false;
  }

  // Method to get image data URL for preview
  getImageDataUrl(): string {
    if (this.justificationData?.fileContent && this.justificationData?.contentType) {
      return `data:${this.justificationData.contentType};base64,${this.justificationData.fileContent}`;
    }
    return '';
  }

  cancel(): void {
    // Clean up before navigation
    if (this.fileDownloadUrl) {
      URL.revokeObjectURL(this.fileDownloadUrl);
    }
    
    let userRole = localStorage.getItem('role');
    if(userRole == 'ADMIN' || userRole == 'MANAGER') {
      this.router.navigate(['justificationList']);
    } else {
    this.router.navigate(['justificationList/my']);
    }
  }
}