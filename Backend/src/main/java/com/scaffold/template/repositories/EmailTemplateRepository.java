package com.scaffold.template.repositories;

import com.scaffold.template.entities.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    Optional<EmailTemplate> findByNameAndActiveTrue(String name);
    List<EmailTemplate> findByActiveTrue();
}