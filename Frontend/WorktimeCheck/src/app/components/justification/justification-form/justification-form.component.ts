import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JustificationService } from '../../../services/Justification/justification.service';
import { TimeService } from '../../../services/Time/time.service';
import { DatePipe, NgIf } from '@angular/common';
import { EmployeeTime } from '../../../models/employeeTime';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-justification-form',
  imports: [DatePipe, ReactiveFormsModule, NgIf],
  templateUrl: './justification-form.component.html',
  styleUrl: './justification-form.component.css',
})
export class JustificationFormComponent implements OnInit {
  timeId!: number;
  employeeTime?: EmployeeTime;
  justificationForm!: FormGroup;
  selectedFile: File | null = null;
  
  private fb: FormBuilder = inject(FormBuilder);
  private justificationService: JustificationService = inject(JustificationService);
  private timeService: TimeService = inject(TimeService);
  private toastService: ToastrService = inject(ToastrService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.justificationForm = this.fb.group({
      justificationObservation: ['', Validators.required],
    });
    
    // Get timeId from route parameters
    this.route.params.subscribe(params => {
      this.timeId = +params['timeId']; // Convert to number
      if (this.timeId) {
        this.loadEmployeeTime();
      }
    });
  }

  private loadEmployeeTime(): void {
    this.timeService.getEmployeeTimeById(this.timeId).subscribe({
      next: (employeeTime: EmployeeTime) => {
        this.employeeTime = employeeTime;
      },
      error: (err: any) => {
        console.error('Error loading employee time:', err);
        this.toastService.error('Error al cargar los datos del tiempo');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.toastService.info('Archivo seleccionado:'+ file.name+ ' Tipo:'+ file.type+ ' Tamaño:'+ file.size);
    }
  }

  submitJustification(): void {
    if (!this.justificationForm.valid) {
      console.error('Formulario no válido');
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.selectedFile) {
      console.error('No se ha seleccionado archivo');
      this.toastService.error('Por favor selecciona un archivo');
      return;
    }

    const justificationDto = {
      timeId: this.timeId,
      justificationObservation: this.justificationForm.value.justificationObservation,
    };

    console.log('Justification DTO a enviar:', justificationDto);
    console.log('Archivo a enviar:', this.selectedFile.name);

    const formData = new FormData();
    
    // Agregar el archivo
    formData.append('file', this.selectedFile);
    
    // Agregar el JSON como Blob
    formData.append(
      'justification',
      new Blob([JSON.stringify(justificationDto)], { 
        type: 'application/json' 
      })
    );

    // Debug: ver el contenido del FormData
    console.log('FormData creado:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.justificationService.sendJustification(formData).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        this.toastService.success('Justificación enviada correctamente');
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error completo:', err);
        const errorMessage = err.error?.message || err.message || 'Error desconocido';
        this.toastService.error('Error al enviar justificación: ', errorMessage);
      },
    });
  }

  private resetForm(): void {
    this.justificationForm.reset();
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  cancel(): void {
    this.router.navigate(['timeList']);
  }
}