package com.scaffold.template.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification {
    private Long notificationId;

    private String notificationSender;

    private String notificationReceiver;

    private String notificationSubject;

    private Boolean notificationSentstatus;
}
