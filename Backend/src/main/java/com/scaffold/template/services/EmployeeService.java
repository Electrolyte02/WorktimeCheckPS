package com.scaffold.template.services;

import com.scaffold.template.dtos.EmployeeDto;
import com.scaffold.template.models.Employee;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmployeeService {
    Employee getEmployee(Long id);
    List<EmployeeDto> getEmployeeList();
    Employee createEmployee(EmployeeDto employeeDto, Long userId);
    Employee updateEmployee(EmployeeDto employeeDto, Boolean changeTime , Long userId);
    boolean deleteEmployee(Long employeeId , Long userId);
    Page<EmployeeDto> getEmployeesPaged(int page, int size, String search, Long userId);
    Page<EmployeeDto> getEmployeesPagedByArea(int page, int size, String search, Long userId);
    Employee getEmployeeByEmail(String employeeEmail);
    Employee getEmployeeByUserId(Long userId);
}
