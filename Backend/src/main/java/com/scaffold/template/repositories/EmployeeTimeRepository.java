package com.scaffold.template.repositories;

import com.scaffold.template.entities.EmployeeTimeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeTimeRepository extends JpaRepository<EmployeeTimeEntity, Long> {
    List<EmployeeTimeEntity> findByTimeTypeAndEmployeeId(char timeType, Long employeeId);

    Page<EmployeeTimeEntity> searchByEmployeeId(Long employeeId, Pageable pageable);

    // Paginated version to find employee times by area ID
    @Query("SELECT et FROM EmployeeTimeEntity et JOIN et.employee e WHERE e.employeeArea.id = :areaId")
    Page<EmployeeTimeEntity> findByAreaId(@Param("areaId") Long areaId, Pageable pageable);


    @Query("SELECT COUNT(et) FROM EmployeeTimeEntity et WHERE et.timeDay BETWEEN :from AND :to")
    Long countByTimeBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COUNT(et) FROM EmployeeTimeEntity et WHERE et.timeDay BETWEEN :from AND :to AND et.timeOnTime = :onTime")
    Long countByTimeBetweenAndOnTime(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("onTime") Boolean onTime);

    @Query("""
    SELECT COUNT(et)
    FROM EmployeeTimeEntity et
    JOIN et.employee e
    JOIN e.employeeArea a
    WHERE a.id = :areaId
      AND et.timeDay BETWEEN :from AND :to
      AND et.timeOnTime = false
""")
    Long countNotOnTimeByAreaAndTimeBetween(
            @Param("areaId") Long areaId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

}
