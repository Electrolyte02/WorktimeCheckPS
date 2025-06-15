package com.scaffold.template.repositories;

import com.scaffold.template.entities.JustificationCheckEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JustificationCheckRepository extends JpaRepository<JustificationCheckEntity, Long> {

    // Method to find checks by employee ID with pagination
    @Query("SELECT jc FROM JustificationCheckEntity jc " +
            "JOIN jc.justification tj " +
            "JOIN tj.time et " +
            "WHERE et.employeeId = :employeeId")
    Page<JustificationCheckEntity> findByEmployeeId(@Param("employeeId") Long employeeId, Pageable pageable);

    JustificationCheckEntity findByJustificationId(Long justificationId);
}