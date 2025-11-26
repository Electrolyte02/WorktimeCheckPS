package com.scaffold.template.controllers;

import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.services.EmployeeTimeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
@RequestMapping("/time")
public class EmployeeTimeController {

    @Autowired
    private EmployeeTimeService timeService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @GetMapping("/paged")
    public ResponseEntity<Page<EmployeeTime>> getEmployeeTimesPaged(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long employeeId
    ) {
        Page<EmployeeTime> times = timeService.getEmployeeTimesByEmployee(page,size,employeeId, userId);
        return ResponseEntity.ok(times);
    }

    @GetMapping("/{timeId}")
    public ResponseEntity<EmployeeTime> getEmployeeTimeById(@PathVariable Long timeId){
        EmployeeTime time = timeService.getEmployeeTimeById(timeId);
        return ResponseEntity.ok(time);
    }

    @GetMapping("/paged/my")
    public ResponseEntity<Page<EmployeeTime>> getEmployeeTimesPagedByUser(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestHeader("X-User-Id") Long userId
    ) {
        Page<EmployeeTime> times = timeService.getEmployeeTimesByUserId(page,size,userId);
        return ResponseEntity.ok(times);
    }
}
