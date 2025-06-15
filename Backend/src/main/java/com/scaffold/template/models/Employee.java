package com.scaffold.template.models;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Employee {
    private Long employeeId;

    private  String employeeName;

    private String employeeLastName;

    private String employeeDocument;

    private String employeeEmail;

    private Long employeeState;

    private Long auditUser;

    private Area employeeArea;

    private List<EmployeeShift> employeeShifts;
}
