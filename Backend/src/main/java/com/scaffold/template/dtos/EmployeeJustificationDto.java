package com.scaffold.template.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class EmployeeJustificationDto {
    private Long justificationId;
    private String employeeFullName;
    private Long justificationState;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime justificationDate;

    public EmployeeJustificationDto(Long justificationId, String employeeFullName, Long justificationState, LocalDateTime justificationDate) {
        this.justificationId = justificationId;
        this.employeeFullName = employeeFullName;
        this.justificationState = justificationState;
        this.justificationDate = justificationDate;
    }
}
