package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "employee_times")
public class EmployeeTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_id", nullable = false)
    private Long timeId;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", insertable = false, updatable = false)
    private EmployeeEntity employee;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "time_day", nullable = false)
    private LocalDateTime timeDay;

    @Column(name = "time_type", nullable = false)
    private char timeType;

    @Column(name = "time_ontime", nullable = false)
    private boolean timeOnTime;

    @Column(name = "time_state", nullable = false)
    private Long timeState;

    @Column(name = "time_auduser", nullable = false)
    private Long timeAudUser;
}
