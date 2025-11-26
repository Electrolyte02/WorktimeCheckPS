package com.scaffold.template.repositories;

import com.scaffold.template.entities.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    @Query("""
    SELECT n FROM NotificationEntity n\s
    WHERE n.notificationSentTime BETWEEN :from AND :to
           \s""")
    Page<NotificationEntity> findAllPagedBetween(@Param("from")LocalDateTime from, @Param("to") LocalDateTime to, Pageable pageable);

}
