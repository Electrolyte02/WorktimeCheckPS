package com.scaffold.template.services;

import com.scaffold.template.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface NotificationService {
    Notification createNotification(Notification notification, Long userId);
    Notification updateNotification(Notification notification, Long userId, boolean result);
    Notification getNotificationById(Long notificationId, Long userId);
    Page<Notification> getNotificationsPaged(int page, int size);
}
