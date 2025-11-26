package com.scaffold.template.services.impl;

import com.scaffold.template.entities.NotificationEntity;
import com.scaffold.template.models.Notification;
import com.scaffold.template.repositories.NotificationRepository;
import com.scaffold.template.services.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        return entity.map(notificationEntity -> modelMapper.map(notificationEntity, Notification.class)).orElse(null);
    }

    @Override
    public Page<Notification> getNotificationsPaged(int page,
                                                    int size,
                                                    LocalDateTime from,
                                                    LocalDateTime to) {
        Pageable pageable = PageRequest.of(page,size);

        Page<NotificationEntity> entityPage = notificationRepository.findAllPagedBetween(from,to,pageable);

        return entityPage.map(e -> modelMapper.map(e, Notification.class));
    }
}
