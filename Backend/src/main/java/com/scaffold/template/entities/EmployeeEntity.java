package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "employees")
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "employee_name", nullable = false)
    private  String employeeName;

    @Column(name = "employee_surname", nullable = false)
    private String employeeLastName;

    @Column(name = "employee_document", nullable = false)
    private String employeeDocument;

    @Column(name = "employee_email", nullable = false)
    private String email;

    @Column(name = "employee_state", nullable = false)
    private Long employeeState;

    @Column(name = "employee_auduser", nullable = false)
    private Long auditUser;

    @ManyToOne
    @JoinColumn(name = "area_id", nullable = false)
    private AreaEntity employeeArea;
}
