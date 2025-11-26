package com.scaffold.template.repositories;

import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.entities.TimeJustificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TimeJustificationRepository extends JpaRepository<TimeJustificationEntity, Long> {
    @Query("""
    SELECT tj FROM TimeJustificationEntity tj
    JOIN tj.time t
    WHERE t.employeeId = :employeeId
""")
    Page<TimeJustificationEntity> findByEmployeeId(@Param("employeeId") Long employeeId, Pageable pageable);

    @Query("""
    SELECT tj FROM TimeJustificationEntity tj
    JOIN tj.time t
    JOIN t.employee e
    JOIN e.employeeArea a
    WHERE a.id = :areaId
    AND tj.timeState = 1
""")
    Page<TimeJustificationEntity> findPendingdByAreaId(@Param("areaId") Long areaId, Pageable pageable);


    @Query("""
    SELECT COUNT(tj)\s
    FROM TimeJustificationEntity tj\s
    WHERE tj.time.timeDay BETWEEN :start AND :end\s
      AND tj.timeState = :state
""")
    Long countByTimeDayBetweenAndState(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end,
                                       @Param("state") Long state);

    @Query("""
        SELECT COUNT(tj)\s
        FROM TimeJustificationEntity tj\s
        JOIN tj.time t
        WHERE t.timeDay BETWEEN :start AND :end
        AND tj.timeState = :state
        AND t.employeeId = :id
""")
    Long countByTimeDayBetweenAndStateByEmployee(@Param("start") LocalDateTime start,
                                                 @Param("end") LocalDateTime end,
                                                 @Param("state") Long state,
                                                 @Param("id") Long id);

    @Query("""
        SELECT COUNT(tj)\s
        FROM TimeJustificationEntity tj\s
        JOIN tj.time t
        JOIN t.employee e
        JOIN e.employeeArea a
        WHERE t.timeDay BETWEEN :start AND :end
        AND tj.timeState = :state
        AND a.id = :id
""")
    Long countByTimeDayBetweenAndStateByArea(@Param("start") LocalDateTime start,
                                                 @Param("end") LocalDateTime end,
                                                 @Param("state") Long state,
                                                 @Param("id") Long id);
}
