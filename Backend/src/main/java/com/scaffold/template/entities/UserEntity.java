package com.scaffold.template.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_email")
    private String email;

    @Column(name = "user_password")
    private String password;

    @Column(name = "user_state")
    private Long userState;

    @Column(name = "user_audUser")
    private Long userAud;

    @Column(name = "user_role")
    private String userRole;

    @Column(name = "user_employee")
    private Long employeeId;

    @OneToOne
    @JoinColumn(name = "user_employee", referencedColumnName = "employee_id", insertable = false, updatable = false)
    private EmployeeEntity employeeEntity;
}