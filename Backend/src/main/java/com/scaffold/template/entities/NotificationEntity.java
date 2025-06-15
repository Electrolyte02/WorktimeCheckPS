package com.scaffold.template.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "notifications")
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", nullable = false)
    private Long notificationId;

    @Column(name = "notification_sender", length = 100)
    private String notificationSender;

    @Column(name = "notification_receiver", length = 100)
    private String notificationReceiver;

    @Column(name = "notification_subject", length = 100)
    private String notificationSubject;

    @Column(name = "notification_senttime")
    private LocalDateTime notificationSentTime;

    @Column(name = "notification_sentstatus")
    private Boolean notificationSentstatus;

    @Column(name = "notification_auduser")
    private Long notificationAuduser;
}
