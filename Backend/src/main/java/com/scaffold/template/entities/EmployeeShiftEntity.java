package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "employee_shifts")
public class EmployeeShiftEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_id", nullable = false)
    private Long shiftId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "shift_day", nullable = false, length = 20)
    private String shiftDay;

    @Column(name = "shift_entry", nullable = false)
    private LocalTime shiftEntry;

    @Column(name = "shift_exit", nullable = false)
    private LocalTime shiftExit;

    @Column(name = "shift_duration", nullable = true)
    private Long shiftDuration;

    @Column(name = "shift_state", nullable = false)
    private Long shiftState;

    @Column(name = "shift_auduser", nullable = false)
    private Long shiftAudUser;
}
