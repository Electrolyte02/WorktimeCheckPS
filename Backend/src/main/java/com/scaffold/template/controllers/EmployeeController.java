package com.scaffold.template.controllers;

import com.scaffold.template.dtos.EmployeeDto;
import com.scaffold.template.models.Employee;
import com.scaffold.template.services.EmployeeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;


    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployee(@RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        Employee employee = employeeService.getEmployee(id);
        if (employee != null) {
            return ResponseEntity.ok(mapper.map(employee,EmployeeDto.class));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestHeader("X-User-Id") Long userId,
            @RequestBody EmployeeDto dto){
        Employee employee = employeeService.createEmployee(dto, userId);
        return ResponseEntity.ok(mapper.map(employee,EmployeeDto.class));
    }

    @GetMapping("/paged")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getEmployeesPaged(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String search
    ) {
        Page<EmployeeDto> employees = employeeService.getEmployeesPaged(page, size, search, userId);
        return ResponseEntity.ok(employees);
    }

    /*@GetMapping("/paged/area")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EmployeeDto>> getEmployeesPagedByArea(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        Page<EmployeeDto> employees = employeeService.getEmployeesPagedByArea(page, size, userId);
        return ResponseEntity.ok(employees);
    }*/

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteEmployee(@RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id)
    {
        if (employeeService.deleteEmployee(id, userId))
        {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/{changeTime}")
    public ResponseEntity<EmployeeDto> updateEmployee(@RequestHeader("X-User-Id") Long userId,
            @RequestBody EmployeeDto dto, @RequestParam Boolean changeTime){
        Employee employee = employeeService.updateEmployee(dto, changeTime, userId);
        return ResponseEntity.ok(mapper.map(employee,EmployeeDto.class));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EmployeeDto>> getEmployeeList() {
        return ResponseEntity.ok(employeeService.getEmployeeList());
    }
}
