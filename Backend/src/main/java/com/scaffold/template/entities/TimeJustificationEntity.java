package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "time_justifications")
public class TimeJustificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "justification_id")
    private Long justificationId;

    @OneToOne
    @JoinColumn(name = "time_id", referencedColumnName = "time_id", insertable = false, updatable = false)
    private EmployeeTimeEntity time;

    @Column(name = "time_id", nullable = false)
    private Long timeId;

    @Column(name = "justification_observation")
    private String justificationObservation;

    @Column(name = "justification_url")
    private String justificationUrl;

    @Column(name = "time_state", nullable = false)
    private Long timeState;

    @Column(name = "time_auduser", nullable = false)
    private Long timeAudUser;
}
