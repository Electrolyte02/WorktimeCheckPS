import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { Area } from '../../../models/area';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/Employee/employee.service';
import { Employee } from '../../../models/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '../../../services/Area/area.service';
import { ToastrService } from 'ngx-toastr';

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

  employeeService = inject(EmployeeService);
  areaService = inject(AreaService);
  private toastService:ToastrService = inject(ToastrService);
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

  employeeForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    document: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    entryTime: new FormControl(''),
    exitTime: new FormControl(''),
    area: new FormControl(1, Validators.required),
    distinctSchedules: new FormControl(false),
    changeSchedules: new FormControl(false), // New control for schedule changes
    daySchedules: new FormArray([]),
  });

  ngOnInit(): void {
    this.areaService.getAreas().subscribe(response => {
      this.areas=response;
    });

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
            area: employee.employeeArea.id,
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
          this.toastService.error('No se pudo cargar el empleado', err.error);
        },
      });
    }

    this.employeeForm
      .get('distinctSchedules')
      ?.valueChanges.subscribe((distinct) => {
        this.onScheduleModeChange();
      });
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
          this.daySchedules.push(
            new FormGroup({
              day: new FormControl(day),
              entryTime: new FormControl('', Validators.required),
              exitTime: new FormControl('', Validators.required),
            })
          );
        }
      });
    }
  }

  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
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
      employeeArea: this.areas.find((a) => a.id == formValues.area)!,
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
          this.toastService.success('Empleado creado exitosamente');
          this.employeeForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Error al guardar el empleado', err.error);
        },
      });
    }
  }

  updateEmployee(employee: Employee, changeSchedules: boolean = false) {
    this.employeeService.updateEmployee(employee, changeSchedules).subscribe({
      next: () => {
        this.toastService.success('Empleado actualizado exitosamente');
        this.router.navigate(['/employeeList']);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al actualizar el empleado', err.error);
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