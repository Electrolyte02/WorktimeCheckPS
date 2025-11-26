package com.scaffold.template.services;

import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.reporting.KeyPerformanceIndicators;
import com.scaffold.template.reporting.LineChartDto;
import com.scaffold.template.reporting.PieChartDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface DashboardService {
    KeyPerformanceIndicators getKpis(LocalDateTime from, LocalDateTime to);
    KeyPerformanceIndicators getKpisByEmployee(LocalDateTime from, LocalDateTime to, Long employeeId);
    KeyPerformanceIndicators getKpisByArea(LocalDateTime from, LocalDateTime to, Long areaId);
    PieChartDto getPieChart(LocalDateTime from, LocalDateTime to);
    PieChartDto getPieChartByEmployee(LocalDateTime from, LocalDateTime to, Long employeeId);
    PieChartDto getPieChartByArea(LocalDateTime from, LocalDateTime to, Long areaId);
    LineChartDto getLineChart(LocalDateTime from, LocalDateTime to);
    ReportingDto getReports(LocalDateTime from, LocalDateTime to, Long userId);
    List<EmployeeTime> getTopFiveTimesToJustifyByEmployee(Long employeeId);
    List<EmployeeJustificationDto> getTopFiveJustficationsToAuditByArea(Long areaId);
}
