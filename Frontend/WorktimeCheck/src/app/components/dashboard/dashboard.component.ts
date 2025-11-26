import { Component, inject, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../services/Dashboard/dashboard.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeJustificationDto } from '../../services/Justification/justification.service';
import { EmployeeTime } from '../../models/employeeTime';

@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userRole: string | null = "";

  // KPIs
  kpis: any = {};
  
  // Chart data
  pieChartData: any[] = [];
  lineChartData: any[] = [];
  
  // Top 5 justifications for managers
  topJustifications: EmployeeJustificationDto[] = [];
  
  // Top 5 times to justify for employees
  topTimesToJustify: EmployeeTime[] = [];
  
  private dashboardService: DashboardService = inject(DashboardService);
  private router: Router = inject(Router);
  
  // Chart options
  view: [number, number] = [700, 400];
  
  // Pie chart options
  gradient = true;
  
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendTitle: string = 'Glosario';
  legendPosition: string = 'below';
  
  // Line chart options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Areas';
  showYAxisLabel = true;
  yAxisLabel = 'Fuera de Horario';
  timeline = false;
  
  // Color schemes
  pieColorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB']
  };
  
  lineColorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  // Date range
  fromDate: string = '';
  toDate: string = '';
  
  loading = false;
  loadingJustifications = false;
  loadingTimesToJustify = false;

  constructor() {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000));
    
    this.toDate = today.toISOString().slice(0, 16);
    this.fromDate = thirtyDaysAgo.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.loadDashboardData();
    
    // Load top justifications if user is a manager
    if (this.userRole === 'MANAGER') {
      this.loadTopJustifications();
    }
    
    // Load top times to justify if user is an employee
    if (this.userRole === 'EMPLOYEE') {
      this.loadTopTimesToJustify();
    }
  }

  loadDashboardData(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }

    this.loading = true;
    if(this.userRole == 'ADMIN') {
    this.dashboardService.getReports(this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.kpis = data.kpis.indicatorsMap;
        this.pieChartData = this.transformPieChartData(data.pieChart.pieChartList);
        this.lineChartData = this.transformLineChartData(data.lineChart.lineChartList);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
    }
    else {
          this.dashboardService.getReports(this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.kpis = data.kpis.indicatorsMap;
        this.pieChartData = this.transformPieChartData(data.pieChart.pieChartList);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
    }
  }

  loadTopJustifications(): void {
    this.loadingJustifications = true;
    
    this.dashboardService.getTopFiveJustificationsToAudit().subscribe({
      next: (data) => {
        this.topJustifications = data;
        this.loadingJustifications = false;
      },
      error: (error) => {
        console.error('Error loading top justifications:', error);
        this.loadingJustifications = false;
      }
    });
  }

  private transformPieChartData(data: any[]): any[] {
    return data.map(item => ({
      name: item.name,
      value: item.value
    }));
  }

  private transformLineChartData(data: any[]): any[] {
    if(this.userRole =='ADMIN') {
    return [{
      name: 'Not On Time',
      series: data.map(item => ({
        name: item.name,
        value: item.value
      }))
    }];
    } else {
      return [];
    }
  }

  onDateRangeChange(): void {
    this.loadDashboardData();
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  loadTopTimesToJustify(): void {
    this.loadingTimesToJustify = true;
    
    this.dashboardService.getTopFiveTimesToJustify().subscribe({
      next: (data) => {
        this.topTimesToJustify = data;
        this.loadingTimesToJustify = false;
      },
      error: (error) => {
        console.error('Error loading top times to justify:', error);
        this.loadingTimesToJustify = false;
      }
    });
  }
  reviewJustification(justificationId: number): void {
    this.router.navigate(['/check', justificationId]);
  }

  // Helper method to get justification state text
  getJustificationStateText(state: number): string {
    switch (state) {
      case 0: return 'Pendiente';
      case 1: return 'Aprobada';
      case 2: return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  // Helper method to get justification state class for styling
  getJustificationStateClass(state: number): string {
    switch (state) {
      case 0: return 'state-pending';
      case 1: return 'state-approved';
      case 2: return 'state-rejected';
      default: return 'state-unknown';
    }
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeTypeText(arg0: string) {
    if(arg0 == 'E'){
      return 'Entrada'
    }
    else {
      return 'Salida'
    }
  }

  justifyTime(arg0: number) {
    this.router.navigate(['/justification', arg0]);
  }
}