package com.scaffold.template.services;

import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.reporting.KeyPerformanceIndicators;
import com.scaffold.template.reporting.LineChartDto;
import com.scaffold.template.reporting.PieChartDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public interface DashboardService {
    KeyPerformanceIndicators getKpis(LocalDateTime from, LocalDateTime to);
    PieChartDto getPieChart(LocalDateTime from, LocalDateTime to);
    LineChartDto getLineChart(LocalDateTime from, LocalDateTime to);
    ReportingDto getReports(LocalDateTime from, LocalDateTime to);
}
