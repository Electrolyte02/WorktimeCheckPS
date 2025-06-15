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
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUserName(String userName);
    Optional<UserEntity> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);

    @Query("""
    SELECT u FROM UserEntity u\s
    WHERE LOWER(u.email) LIKE %:search%\s
""")
    Page<UserEntity> searchByEmail(@Param("search") String search, Pageable pageable);

}
