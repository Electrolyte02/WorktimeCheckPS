package com.scaffold.template.repositories;

import com.scaffold.template.entities.EmployeeEntity;
import com.scaffold.template.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity,Long> {
    @Query("""
    SELECT e FROM EmployeeEntity e\s
    WHERE LOWER(e.employeeName) LIKE %:search%\s
""")
    Page<EmployeeEntity> searchByName(@Param("search") String search, Pageable pageable);

    @Query("""
    SELECT e FROM EmployeeEntity e\s
    WHERE e.employeeArea.id = :areaId\s
    AND LOWER(e.employeeName) LIKE %:search%\s
""")
    Page<EmployeeEntity> searchByAreaId(@Param("areaId") Long areaId,@Param("search") String search, Pageable pageable);

    @Query("""
    SELECT e FROM EmployeeEntity e\s
    WHERE e.employeeArea.id = :areaId\s
""")
    Page<EmployeeEntity> findByAreaId(@Param("areaId") Long areaId, Pageable pageable);


    Optional<EmployeeEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
    SELECT u.employeeEntity FROM UserEntity u\s
    WHERE u.id = :userId
""")
    Optional<EmployeeEntity> findByUserId(@Param("userId") Long userId);
}
