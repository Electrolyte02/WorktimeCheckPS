import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { JustificationService, TimeJustificationDto } from '../../../services/Justification/justification.service';
import { CheckService, Check } from '../../../services/Check/check.service';

@Component({
  selector: 'app-check-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-form.component.html',
  styleUrl: './check-form.component.css'
})
export class CheckFormComponent implements OnInit, OnDestroy {
  checkForm!: FormGroup;
  justificationData?: TimeJustificationDto;
  justificationId!: number;
  fileDownloadUrl?: string;
  isLoading = false;
  isSubmitting = false;
  error?: string;
  submitError?: string;

  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private justificationService: JustificationService = inject(JustificationService);
  private checkService: CheckService = inject(CheckService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadJustificationIdFromRoute();
  }

  ngOnDestroy(): void {
    // Clean up object URL to prevent memory leaks
    if (this.fileDownloadUrl) {
      URL.revokeObjectURL(this.fileDownloadUrl);
    }
  }

  private initializeForm(): void {
    this.checkForm = this.fb.group({
      checkApproval: [null, [Validators.required]], // true for approve, false for reject
      checkReason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  private loadJustificationIdFromRoute(): void {
    this.route.params.subscribe(params => {
      this.justificationId = +params['justificationId'];
      if (this.justificationId) {
        this.loadJustificationData();
      } else {
        this.error = 'ID de justificación inválido';
      }
    });
  }

  loadJustificationData(): void {
    this.isLoading = true;
    this.error = undefined;

    this.justificationService.getJustification(this.justificationId).subscribe({
      next: (data: TimeJustificationDto) => {
        this.justificationData = data;
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

  onSubmit(): void {
    if (this.checkForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = undefined;

      const formValue = this.checkForm.value;
      const checkData: Omit<Check, 'checkId'> = {
        justificationId: this.justificationId,
        checkApproval: formValue.checkApproval,
        checkReason: formValue.checkReason,
        checkState: 1 // Assuming 1 means processed/completed
      };

      this.checkService.createJustificationCheck(checkData).subscribe({
        next: (response: Check) => {
          console.log('Check created successfully:', response);
          // Navigate back to justification list or show success message
          this.router.navigate(['/justifications']);
        },
        error: (error: any) => {
          console.error('Error creating check:', error);
          this.submitError = 'Error al procesar la justificación. Intente nuevamente.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkForm.controls).forEach(key => {
        this.checkForm.get(key)?.markAsTouched();
      });
    }
  }

  onApprovalChange(approval: boolean): void {
    this.checkForm.patchValue({ checkApproval: approval });
    
    // Clear reason when switching between approve/reject to force user to enter appropriate reason
    this.checkForm.patchValue({ checkReason: '' });
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
    
    // Navigate back to justifications list
    this.router.navigate(['/justifications']);
  }

  // Helper methods for form validation
  get checkApprovalInvalid(): boolean {
    const control = this.checkForm.get('checkApproval');
    return !!(control?.invalid && control?.touched);
  }

  get checkReasonInvalid(): boolean {
    const control = this.checkForm.get('checkReason');
    return !!(control?.invalid && control?.touched);
  }

  getCheckReasonError(): string {
    const control = this.checkForm.get('checkReason');
    if (control?.hasError('required')) {
      return 'La razón es obligatoria';
    }
    if (control?.hasError('minlength')) {
      return 'La razón debe tener al menos 10 caracteres';
    }
    if (control?.hasError('maxlength')) {
      return 'La razón no puede exceder 500 caracteres';
    }
    return '';
  }
}