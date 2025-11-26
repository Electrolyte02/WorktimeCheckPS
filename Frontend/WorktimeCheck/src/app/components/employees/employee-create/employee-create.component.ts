import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Area } from '../../../models/area';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { Employee } from '../../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../../services/Area/area.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-employee-create',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css',
})
export class EmployeeCreateComponent implements OnInit {
  auxOperation = false;
  employeeIdToUpdate: number | null = null;
  auxTime: boolean = false;
  formSubmitted = false;

  employeeService = inject(EmployeeService);
  areaService = inject(AreaService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  get daySchedules(): FormArray {
    return this.employeeForm.get('daySchedules') as FormArray;
  }

  daySelection: { [key: string]: boolean } = {
    L: false,
    M: false,
    X: false,
    J: false,
    V: false,
    S: false,
    D: false,
  };

  areas: Area[] = [];

  // Custom validator for CUIL format
  cuilValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const cuilPattern = /^\d{2}-\d{8,9}-\d{1}$/;
    if (!cuilPattern.test(control.value)) {
      return { pattern: true };
    }
    
    return null;
  }

  // Custom validator for time range
  timeRangeValidator(control: AbstractControl): ValidationErrors | null {
    const entryTime = control.get('entryTime')?.value;
    const exitTime = control.get('exitTime')?.value;
    
    if (!entryTime || !exitTime) {
      return null;
    }
    
    const entry = new Date(`1970-01-01T${entryTime}:00`);
    const exit = new Date(`1970-01-01T${exitTime}:00`);
    
    if (exit <= entry) {
      control.get('exitTime')?.setErrors({ timeRange: true });
      return { timeRange: true };
    }
    
    // Clear the error if time range is valid
    const exitTimeControl = control.get('exitTime');
    if (exitTimeControl?.errors?.['timeRange']) {
      delete exitTimeControl.errors['timeRange'];
      if (Object.keys(exitTimeControl.errors).length === 0) {
        exitTimeControl.setErrors(null);
      }
    }
    
    return null;
  }

  employeeForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    document: new FormControl('', [Validators.required, this.cuilValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    entryTime: new FormControl(''),
    exitTime: new FormControl(''),
    area: new FormControl('', Validators.required), // Changed default value to empty string
    distinctSchedules: new FormControl(false),
    changeSchedules: new FormControl(false),
    daySchedules: new FormArray([]),
  });

  ngOnInit(): void {
    this.areaService.getAreas().subscribe(response => {
      this.areas = response;
    });

    // Add validators for schedule times
    this.updateScheduleValidators();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.auxOperation = true;
      this.employeeIdToUpdate = Number(idParam);
      this.employeeService.getEmployeeById(this.employeeIdToUpdate).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            firstName: employee.employeeName,
            lastName: employee.employeeLastName,
            document: employee.employeeDocument,
            email: employee.employeeEmail,
            area: employee.employeeArea.id.toString(),
            entryTime: employee.employeeShifts[0]?.shiftEntry || '',
            exitTime: employee.employeeShifts[0]?.shiftExit || '',
          });
          this.employeeForm.get('document')?.disable();
          employee.employeeShifts.forEach(
            (shift) => (this.daySelection[shift.shiftDay] = true)
          );
        },
        error: (err) => {
          console.error(err);
          toast.error('No se pudo cargar el empleado', err.error);
        },
      });
    }

    this.employeeForm
      .get('distinctSchedules')
      ?.valueChanges.subscribe((distinct) => {
        this.onScheduleModeChange();
        this.updateScheduleValidators();
      });

    // Watch for time changes to validate ranges
    this.employeeForm.get('entryTime')?.valueChanges.subscribe(() => {
      this.validateTimeRange();
    });

    this.employeeForm.get('exitTime')?.valueChanges.subscribe(() => {
      this.validateTimeRange();
    });
  }

  updateScheduleValidators(): void {
    const isDistinct = this.employeeForm.get('distinctSchedules')?.value;
    
    if (!isDistinct) {
      // For general schedule, make times required
      this.employeeForm.get('entryTime')?.setValidators([Validators.required]);
      this.employeeForm.get('exitTime')?.setValidators([Validators.required]);
    } else {
      // For distinct schedules, remove validators from general time inputs
      this.employeeForm.get('entryTime')?.setValidators([]);
      this.employeeForm.get('exitTime')?.setValidators([]);
    }
    
    this.employeeForm.get('entryTime')?.updateValueAndValidity();
    this.employeeForm.get('exitTime')?.updateValueAndValidity();
  }

  validateTimeRange(): void {
    const entryTime = this.employeeForm.get('entryTime')?.value;
    const exitTime = this.employeeForm.get('exitTime')?.value;
    
    if (entryTime && exitTime) {
      const entry = new Date(`1970-01-01T${entryTime}:00`);
      const exit = new Date(`1970-01-01T${exitTime}:00`);
      
      const exitTimeControl = this.employeeForm.get('exitTime');
      if (exit <= entry) {
        exitTimeControl?.setErrors({ ...exitTimeControl.errors, timeRange: true });
      } else {
        if (exitTimeControl?.errors?.['timeRange']) {
          delete exitTimeControl.errors['timeRange'];
          if (Object.keys(exitTimeControl.errors).length === 0) {
            exitTimeControl.setErrors(null);
          }
        }
      }
    }
  }

  hasSelectedDays(): boolean {
    return Object.values(this.daySelection).some(selected => selected);
  }

  toggleDay(day: string): void {
    this.daySelection[day] = !this.daySelection[day];

    const dayOrder = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    if (this.employeeForm.get('distinctSchedules')?.value) {
      if (this.daySelection[day]) {
        const newGroup = new FormGroup({
          day: new FormControl(day),
          entryTime: new FormControl('', Validators.required),
          exitTime: new FormControl('', Validators.required),
        });

        // Add time range validator to the group
        newGroup.setValidators(this.timeRangeValidator);

        // Inserta en la posición correcta
        const position = dayOrder
          .filter((d) => this.daySelection[d])
          .indexOf(day);
        this.daySchedules.insert(position, newGroup);
      } else {
        const index = this.daySchedules.controls.findIndex(
          (ctrl) => ctrl.get('day')?.value === day
        );
        if (index !== -1) {
          this.daySchedules.removeAt(index);
        }
      }
    }
  }

  onScheduleModeChange() {
    this.daySchedules.clear(); // Limpia lo anterior

    if (this.employeeForm.get('distinctSchedules')?.value) {
      const dayOrder = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      dayOrder.forEach((day) => {
        if (this.daySelection[day]) {
          const newGroup = new FormGroup({
            day: new FormControl(day),
            entryTime: new FormControl('', Validators.required),
            exitTime: new FormControl('', Validators.required),
          });

          // Add time range validator to the group
          newGroup.setValidators(this.timeRangeValidator);
          
          this.daySchedules.push(newGroup);
        }
      });
    }
    
    this.updateScheduleValidators();
  }

  saveEmployee() {
    this.formSubmitted = true;
    
    // Check if at least one day is selected
    if (!this.hasSelectedDays()) {
      toast.error('Debe seleccionar al menos un día de trabajo');
      return;
    }

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      
      // Mark all day schedule controls as touched
      this.daySchedules.controls.forEach(control => {
        control.markAllAsTouched();
      });
      
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    const formValues = this.employeeForm.getRawValue();
    const isDistinct = formValues.distinctSchedules;

    let employeeShifts: any[] = [];

    if (isDistinct) {
      employeeShifts = this.daySchedules.controls.map((ctrl) => {
        const entry = this.formatTime(ctrl.get('entryTime')?.value);
        const exit = this.formatTime(ctrl.get('exitTime')?.value);
        const duration = this.calculateDuration(entry, exit);
        return {
          employeeId: this.employeeIdToUpdate || 0,
          shiftDay: ctrl.get('day')?.value,
          shiftEntry: entry,
          shiftExit: exit,
          shiftDuration: duration,
        };
      });
    } else {
      const selectedDays = Object.entries(this.daySelection)
        .filter(([_, selected]) => selected)
        .map(([day]) => day);

      const entry = this.formatTime(formValues.entryTime as string);
      const exit = this.formatTime(formValues.exitTime as string);
      const duration = this.calculateDuration(entry, exit);

      employeeShifts = selectedDays.map((day) => ({
        employeeId: this.employeeIdToUpdate || 0,
        shiftDay: day,
        shiftEntry: entry,
        shiftExit: exit,
        shiftDuration: duration,
      }));
    }

    const employee: Employee = {
      employeeId: this.employeeIdToUpdate || 0,
      employeeName: formValues.firstName as string,
      employeeLastName: formValues.lastName as string,
      employeeDocument: formValues.document as string,
      employeeEmail: formValues.email as string,
      employeeArea: this.areas.find((a) => a.id == formValues.area as unknown as number)!,
      employeeState: 1,
      employeeShifts,
    };

    if (this.auxOperation) {
      // Pass the changeSchedules value to the update method
      const changeSchedules = formValues.changeSchedules as boolean;
      this.updateEmployee(employee, changeSchedules);
    } else {
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          toast.success('Empleado creado exitosamente');
          this.employeeForm.reset();
          this.formSubmitted = false;
          // Reset day selection
          Object.keys(this.daySelection).forEach(day => {
            this.daySelection[day] = false;
          });
          this.router.navigate(['/employeeList']);
        },
        error: (err) => {
          toast.error('Error al guardar el empleado', err.error);
        },
      });
    }
  }

  updateEmployee(employee: Employee, changeSchedules: boolean = false) {
    this.employeeService.updateEmployee(employee, changeSchedules).subscribe({
      next: () => {
        toast.success('Empleado actualizado exitosamente');
        this.router.navigate(['/employeeList']);
      },
      error: (err) => {
        console.error(err);
        toast.error('Error al actualizar el empleado', err.error);
      },
    });
  }

  private formatTime(time: string): string {
    const date = new Date(`1970-01-01T${time}:00`);
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  private calculateDuration(entry: string, exit: string): number {
    const start = new Date(`1970-01-01T${entry}`);
    const end = new Date(`1970-01-01T${exit}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  returnList() {
    this.router.navigate(['/employeeList']);
  }
}