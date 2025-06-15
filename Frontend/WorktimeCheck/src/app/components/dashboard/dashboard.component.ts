import { Component, inject, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../../services/Dashboard/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  // KPIs
  kpis: any = {};
  
  // Chart data
  pieChartData: any[] = [];
  lineChartData: any[] = [];
  private dashboardService: DashboardService = inject(DashboardService);
  // Chart options
  view: [number, number] = [700, 400];
  
  // Pie chart options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: string = 'below';
  
  // Line chart options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Areas';
  showYAxisLabel = true;
  yAxisLabel = 'Not On Time Count';
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

  constructor() {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    this.toDate = today.toISOString().slice(0, 16);
    this.fromDate = thirtyDaysAgo.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (!this.fromDate || !this.toDate) {
      return;
    }

    this.loading = true;
    
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

  private transformPieChartData(data: any[]): any[] {
    return data.map(item => ({
      name: item.name,
      value: item.value
    }));
  }

  private transformLineChartData(data: any[]): any[] {
    return [{
      name: 'Not On Time',
      series: data.map(item => ({
        name: item.name,
        value: item.value
      }))
    }];
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
}
