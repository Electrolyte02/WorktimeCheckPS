package com.scaffold.template.services.impl;

import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.entities.AreaEntity;
import com.scaffold.template.entities.EmployeeTimeEntity;
import com.scaffold.template.entities.TimeJustificationEntity;
import com.scaffold.template.models.Employee;
import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.reporting.*;
import com.scaffold.template.repositories.AreaRepository;
import com.scaffold.template.repositories.EmployeeTimeRepository;
import com.scaffold.template.repositories.TimeJustificationRepository;
import com.scaffold.template.services.DashboardService;
import com.scaffold.template.services.EmployeeService;
import com.scaffold.template.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeTimeRepository employeeTimesRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TimeJustificationRepository justificationRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public KeyPerformanceIndicators getKpis(LocalDateTime from, LocalDateTime to) {
        KeyPerformanceIndicators kpis = new KeyPerformanceIndicators();
        kpis.setIndicatorsMap(new HashMap<>());
        // Total Employee Times
        Long totalEmployeeTimes = employeeTimesRepository.countByTimeBetween(from, to);
        kpis.getIndicatorsMap().put("Total de Ingresos y Egresos", totalEmployeeTimes);

        // On Time Count
        Long onTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTime(from, to, true);
        kpis.getIndicatorsMap().put("A Horario", onTimeCount);

        // Not On Time Count
        Long notOnTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTime(from, to, false);
        kpis.getIndicatorsMap().put("Fuera de Horario", notOnTimeCount);

        // On Time Percentage
        Double onTimePercentage = totalEmployeeTimes > 0 ?
                (onTimeCount.doubleValue() / totalEmployeeTimes.doubleValue()) * 100 : 0.0;
        kpis.getIndicatorsMap().put("Porcentaje a Horario", onTimePercentage.longValue());

        return kpis;
    }

    @Override
    public KeyPerformanceIndicators getKpisByEmployee(LocalDateTime from, LocalDateTime to, Long employeeId) {
        KeyPerformanceIndicators kpis = new KeyPerformanceIndicators();
        kpis.setIndicatorsMap(new HashMap<>());
        // Total Employee Times
        Long totalEmployeeTimes = employeeTimesRepository.countByTimeBetweenByEmployee(from, to, employeeId);
        kpis.getIndicatorsMap().put("Total de Ingresos y Egresos", totalEmployeeTimes);

        // On Time Count
        Long onTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTimeByEmployee(from, to, true, employeeId);
        kpis.getIndicatorsMap().put("A Horario", onTimeCount);

        // Not On Time Count
        Long notOnTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTimeByEmployee(from, to, false, employeeId);
        kpis.getIndicatorsMap().put("Fuera de Horario", notOnTimeCount);

        // On Time Percentage
        Double onTimePercentage = totalEmployeeTimes > 0 ?
                (onTimeCount.doubleValue() / totalEmployeeTimes.doubleValue()) * 100 : 0.0;
        kpis.getIndicatorsMap().put("Porcentaje a Horario", onTimePercentage.longValue());

        return kpis;
    }

    @Override
    public KeyPerformanceIndicators getKpisByArea(LocalDateTime from, LocalDateTime to, Long areaId) {
        KeyPerformanceIndicators kpis = new KeyPerformanceIndicators();
        kpis.setIndicatorsMap(new HashMap<>());
        // Total Employee Times
        Long totalEmployeeTimes = employeeTimesRepository.countByTimeBetweenByArea(from, to, areaId);
        kpis.getIndicatorsMap().put("Total de Ingresos y Egresos", totalEmployeeTimes);

        // On Time Count
        Long onTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTimeByArea(from, to, true, areaId);
        kpis.getIndicatorsMap().put("A Horario", onTimeCount);

        // Not On Time Count
        Long notOnTimeCount = employeeTimesRepository.countByTimeBetweenAndOnTimeByArea(from, to, false, areaId);
        kpis.getIndicatorsMap().put("Fuera de Horario", notOnTimeCount);

        // On Time Percentage
        Double onTimePercentage = totalEmployeeTimes > 0 ?
                (onTimeCount.doubleValue() / totalEmployeeTimes.doubleValue()) * 100 : 0.0;
        kpis.getIndicatorsMap().put("Porcentaje a Horario", onTimePercentage.longValue());

        return kpis;
    }

    @Override
    public PieChartDto getPieChart(LocalDateTime from, LocalDateTime to) {
        PieChartDto pieChart = new PieChartDto();
        pieChart.setPieChartList(new ArrayList<>());

        // Approved Justifications (state = 2)
        Long approvedCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 2L);
        pieChart.getPieChartList().add(new PieChart("Aprobados", approvedCount));

        // Rejected Justifications (state = 0)
        Long rejectedCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 3L);
        pieChart.getPieChartList().add(new PieChart("Rechazados", rejectedCount));

        // Pending Justifications (state = 1)
        Long pendingCount = justificationRepository.countByTimeDayBetweenAndState(from, to, 1L);
        pieChart.getPieChartList().add(new PieChart("Pendientes", pendingCount));

        return pieChart;
    }

    @Override
    public PieChartDto getPieChartByEmployee(LocalDateTime from, LocalDateTime to, Long employeeId) {
        PieChartDto pieChart = new PieChartDto();
        pieChart.setPieChartList(new ArrayList<>());

        // Approved Justifications (state = 2)
        Long approvedCount = justificationRepository.countByTimeDayBetweenAndStateByEmployee(from, to, 2L, employeeId);
        pieChart.getPieChartList().add(new PieChart("Aprobados", approvedCount));

        // Rejected Justifications (state = 0)
        Long rejectedCount = justificationRepository.countByTimeDayBetweenAndStateByEmployee(from, to, 3L, employeeId);
        pieChart.getPieChartList().add(new PieChart("Rechazados", rejectedCount));

        // Pending Justifications (state = 1)
        Long pendingCount = justificationRepository.countByTimeDayBetweenAndStateByEmployee(from, to, 1L, employeeId);
        pieChart.getPieChartList().add(new PieChart("Pendientes", pendingCount));

        return pieChart;
    }

    @Override
    public PieChartDto getPieChartByArea(LocalDateTime from, LocalDateTime to, Long areaId) {
        PieChartDto pieChart = new PieChartDto();
        pieChart.setPieChartList(new ArrayList<>());

        // Approved Justifications (state = 2)
        Long approvedCount = justificationRepository.countByTimeDayBetweenAndStateByArea(from, to, 2L, areaId);
        pieChart.getPieChartList().add(new PieChart("Aprobados", approvedCount));

        // Rejected Justifications (state = 0)
        Long rejectedCount = justificationRepository.countByTimeDayBetweenAndStateByArea(from, to, 3L, areaId);
        pieChart.getPieChartList().add(new PieChart("Rechazados", rejectedCount));

        // Pending Justifications (state = 1)
        Long pendingCount = justificationRepository.countByTimeDayBetweenAndStateByArea(from, to, 1L, areaId);
        pieChart.getPieChartList().add(new PieChart("Pendientes", pendingCount));

        return pieChart;
    }

    @Override
    public LineChartDto getLineChart(LocalDateTime from, LocalDateTime to) {
        LineChartDto lineChart = new LineChartDto();
        lineChart.setLineChartList(new ArrayList<>());

        // Get all areas with their not-on-time counts
        List<AreaEntity> allAreas = areaRepository.getAreasEnabled();

        for (AreaEntity area : allAreas) {
            Long notOnTimeCount = employeeTimesRepository.countNotOnTimeByAreaAndTimeBetween(
                    area.getId(), from, to);
            lineChart.getLineChartList().add(new LineChart(area.getDescription(), notOnTimeCount));
        }

        return lineChart;
    }

    @Override
    public ReportingDto getReports(LocalDateTime from, LocalDateTime to, Long userId) {
        ReportingDto reports = new ReportingDto();
        Employee employee = employeeService.getEmployeeByUserId(userId);
        if (userService.isUserAdmin(userId)) {
            reports.setKpis(getKpis(from, to));
            reports.setPieChart(getPieChart(from, to));
            reports.setLineChart(getLineChart(from, to));
        }
        else if (areaRepository.existsByAreaResponsible(employee.getEmployeeId())) {
            Optional<AreaEntity> area = areaRepository.findByAreaResponsible(employee.getEmployeeId());
            reports.setKpis(getKpisByArea(from,to,area.get().getId()));
            reports.setPieChart(getPieChartByArea(from,to,area.get().getId()));
        }
        else {
            reports.setKpis(getKpisByEmployee(from,to,employee.getEmployeeId()));
            reports.setPieChart(getPieChartByEmployee(from,to,employee.getEmployeeId()));
        }
        return reports;
    }

    @Override
    public List<EmployeeTime> getTopFiveTimesToJustifyByEmployee(Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);

        Pageable pageable = PageRequest.of(0,5);
        Page<EmployeeTimeEntity> page = employeeTimesRepository.findByEmployeeIdAndNotOnTime(employee.getEmployeeId(), pageable);

        return page.map(e -> modelMapper.map(e, EmployeeTime.class)).stream().toList();
    }

    @Override
    public List<EmployeeJustificationDto> getTopFiveJustficationsToAuditByArea(Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);
        if(areaRepository.existsByAreaResponsible(employee.getEmployeeId())) {
           Optional<AreaEntity> area = areaRepository.findByAreaResponsible(employee.getEmployeeId());
           Pageable pageable = PageRequest.of(0,5);

           Page<TimeJustificationEntity> page = justificationRepository.findPendingdByAreaId(area.get().getId(), pageable);
           List<EmployeeJustificationDto> list = new ArrayList<>();
            for (TimeJustificationEntity e : page.getContent()) {
                list.add(new EmployeeJustificationDto(e.getJustificationId(),
                        e.getTime().getEmployee().getEmployeeName()+' '+e.getTime().getEmployee().getEmployeeLastName(),
                        e.getTimeState(),
                        e.getTime().getTimeDay()));
            }
            return list;
        }
        return List.of();
    }


}
