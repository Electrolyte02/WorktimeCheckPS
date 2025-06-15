package com.scaffold.template.controllers;


import com.scaffold.template.dtos.ReportingDto;
import com.scaffold.template.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/reports")
    public ResponseEntity<ReportingDto> getReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(dashboardService.getReports(from, to));
    }
}
