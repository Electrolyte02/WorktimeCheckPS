package com.scaffold.template.services;

import com.scaffold.template.models.EmployeeShift;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmployeeShiftService {
    List<EmployeeShift> getEmployeeShiftsByEmployee(Long employeeId);
    EmployeeShift createShift(EmployeeShift shift , Long userId);
    EmployeeShift updateShift(EmployeeShift shift, Long userId);
    boolean deleteShift(Long shiftId, Long userId);
    boolean deleteShiftsByEmployee(Long employeeId, Long userId);
}
