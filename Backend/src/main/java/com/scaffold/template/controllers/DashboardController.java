package com.scaffold.template.controllers;


import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/reports")
    public ResponseEntity<ReportingDto> getReports(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(dashboardService.getReports(from, to, userId));
    }

    @GetMapping("/reports/employee")
    public ResponseEntity<List<EmployeeTime>> getEmployeeReport(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(dashboardService.getTopFiveTimesToJustifyByEmployee(userId));
    }

    @GetMapping("/reports/area")
    public ResponseEntity<List<EmployeeJustificationDto>> getAreaReport(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(dashboardService.getTopFiveJustficationsToAuditByArea(userId));
    }
}
