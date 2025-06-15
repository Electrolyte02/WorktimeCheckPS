package com.scaffold.template.dtos;

import com.scaffold.template.reporting.KeyPerformanceIndicators;
import com.scaffold.template.reporting.LineChartDto;
import com.scaffold.template.reporting.PieChartDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportingDto {
    private LineChartDto lineChart;
    private PieChartDto pieChart;
    private KeyPerformanceIndicators kpis;
}
