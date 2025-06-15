package com.scaffold.template.dtos;

import com.scaffold.template.models.Area;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class EmployeeDto {
    private Long employeeId;

    @NotNull
    private  String employeeName;

    @NotNull
    private String employeeLastName;

    @NotNull
    private String employeeDocument;

    @NotNull
    private String employeeEmail;

    @NotNull
    private Area employeeArea;

    @NotNull
    private Long employeeState;

    @NotNull
    private List<EmployeeShiftDto> employeeShifts;
}
