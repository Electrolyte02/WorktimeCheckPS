package com.scaffold.template.repositories;

import com.scaffold.template.entities.AreaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<AreaEntity, Long> {
    Optional<AreaEntity> findByDescription(String description);
    Optional<AreaEntity> findByAreaResponsible(Long responsibleId);

    @Query("""
    SELECT a FROM AreaEntity a\s
    WHERE a.areaResponsible = :employeeId
""")
    Optional<AreaEntity> findByResponsibleEmployeeId(@Param("employeeId") Long employeeId);

    boolean existsByAreaResponsible(Long responsibleId);
}
