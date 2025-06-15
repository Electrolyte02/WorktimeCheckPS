import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KPIs {
  indicatorsMap: { [key: string]: number };
}

export interface PieChartData {
  pieChartList: Array<{ name: string; value: number }>;
}

export interface LineChartData {
  lineChartList: Array<{ name: string; value: number }>;
}

export interface ReportingData {
  kpis: KPIs;
  pieChart: PieChartData;
  lineChart: LineChartData;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/dashboard'; 
  private http: HttpClient = inject(HttpClient);

  getKpis(from: string, to: string): Observable<KPIs> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<KPIs>(`${this.apiUrl}/kpis`, { params });
  }

  getPieChart(from: string, to: string): Observable<PieChartData> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<PieChartData>(`${this.apiUrl}/pie-chart`, { params });
  }

  getLineChart(from: string, to: string): Observable<LineChartData> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<LineChartData>(`${this.apiUrl}/line-chart`, { params });
  }

  getReports(from: string, to: string): Observable<ReportingData> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<ReportingData>(`${this.apiUrl}/reports`, { params });
  }
}