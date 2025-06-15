package com.scaffold.template.services.impl;

import com.scaffold.template.entities.NotificationEntity;
import com.scaffold.template.models.Notification;
import com.scaffold.template.repositories.NotificationRepository;
import com.scaffold.template.services.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public Notification createNotification(Notification notification, Long userId) {
        NotificationEntity entity = modelMapper.map(notification, NotificationEntity.class);
        entity.setNotificationAuduser(userId);
        entity.setNotificationSentTime(LocalDateTime.now());
        entity = notificationRepository.save(entity);
        return modelMapper.map(entity, Notification.class);
    }

    @Override
    public Notification updateNotification(Notification notification, Long userId, boolean result) {
        Optional<NotificationEntity> entity = notificationRepository.findById(notification.getNotificationId());
        if (entity.isPresent()){
            entity.get().setNotificationSentstatus(result);
            NotificationEntity savedEntity = notificationRepository.save(entity.get());
            return modelMapper.map(savedEntity, Notification.class);
        }
        return null;
    }

    @Override
    public Notification getNotificationById(Long notificationId, Long userId) {
        Optional<NotificationEntity> entity = notificationRepository.findById(notificationId);
        if (entity.isPresent()){
            return modelMapper.map(entity.get(),Notification.class);
        }
        return null;
    }

    @Override
    public Page<Notification> getNotificationsPaged(int page, int size) {
        return null;
    }
}
