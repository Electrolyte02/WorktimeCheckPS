package com.scaffold.template.services.impl;

import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.entities.AreaEntity;
import com.scaffold.template.models.Area;
import com.scaffold.template.reporting.*;
import com.scaffold.template.repositories.AreaRepository;
import com.scaffold.template.repositories.EmployeeTimeRepository;
import com.scaffold.template.repositories.TimeJustificationRepository;
import com.scaffold.template.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeTimeRepository employeeTimesRepository;

    @Autowired
    private TimeJustificationRepository justificationRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Override
    public KeyPerformanceIndicators getKpis(LocalDateTime from, LocalDateTime to) {
        KeyPerformanceIndicators kpis = new KeyPerformanceIndicators();

        // Total Employee Times
        Long totalEmployeeTimes = employeeTimesRepository.countByTimeBetween(from, to);
        kpis.getIndicatorsMap().put("Total Employee Times", totalEmployeeTimes);

        // On Time Count
        Long onTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTime(from, to, true);
        kpis.getIndicatorsMap().put("On Time", onTimeCount);

        // Not On Time Count
        Long notOnTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTime(from, to, false);
        kpis.getIndicatorsMap().put("Not On Time", notOnTimeCount);

        // On Time Percentage
        Double onTimePercentage = totalEmployeeTimes > 0 ?
                (onTimeCount.doubleValue() / totalEmployeeTimes.doubleValue()) * 100 : 0.0;
        kpis.getIndicatorsMap().put("On Time Percentage", onTimePercentage.longValue());

        return kpis;
    }

    @Override
    public PieChartDto getPieChart(LocalDateTime from, LocalDateTime to) {
        PieChartDto pieChart = new PieChartDto();

        // Approved Justifications (state = 2)
        Long approvedCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 2L);
        pieChart.getPieChartList().add(new PieChart("Approved", approvedCount));

        // Rejected Justifications (state = 0)
        Long rejectedCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 3L);
        pieChart.getPieChartList().add(new PieChart("Rejected", rejectedCount));

        // Pending Justifications (state = 1)
        Long pendingCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 1L);
        pieChart.getPieChartList().add(new PieChart("Pending", pendingCount));

        return pieChart;
    }

    @Override
    public LineChartDto getLineChart(LocalDateTime from, LocalDateTime to) {
        LineChartDto lineChart = new LineChartDto();

        // Get all areas with their not-on-time counts
        List<AreaEntity> allAreas = areaRepository.findAll();

        for (AreaEntity area : allAreas) {
            Long notOnTimeCount = employeeTimesRepository.countNotOnTimeByAreaAndTimeBetween(
                    area.getId(), from, to);
            lineChart.getLineChartList().add(new LineChart(area.getDescription(), notOnTimeCount));
        }

        return lineChart;
    }

    @Override
    public ReportingDto getReports(LocalDateTime from, LocalDateTime to) {
        ReportingDto reports = new ReportingDto();
        reports.setKpis(getKpis(from, to));
        reports.setPieChart(getPieChart(from, to));
        reports.setLineChart(getLineChart(from, to));
        return reports;
    }
}
