package com.scaffold.template.services;

import com.scaffold.template.models.EmployeeTime;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmployeeTimeService {
    Page<EmployeeTime> getEmployeeTimesByEmployee(int page, int size, Long employeeId, Long userId);
    EmployeeTime updateEmployeeTime(EmployeeTime employeeTime);
    boolean deleteEmployeeTime(Long timeId);
    EmployeeTime getEmployeeTimeById(Long id);
    Page<EmployeeTime> getEmployeeTimesByUserId(int page, int size, Long userId);
    Page<EmployeeTime> getEmployeeTimesByArea(int page, int size, Long employeeId);
}
