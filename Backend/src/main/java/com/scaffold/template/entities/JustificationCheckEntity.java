package com.scaffold.template.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "justification_checks")
public class JustificationCheckEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "check_id")
    private Long checkId ;

    @OneToOne
    @JoinColumn(name = "justification_id", referencedColumnName = "justification_id", insertable = false, updatable = false)
    private TimeJustificationEntity justification;

    @Column(name = "justification_id")
    private Long justificationId;

    @Column(name = "check_approval")
    private Boolean checkApproval;

    @Column(name = "check_reason")
    private String checkReason;

    @Column(name = "check_state", nullable = false)
    private Long checkState;

    @Column(name = "check_auduser", nullable = false)
    private Long checkAudUser;
}
