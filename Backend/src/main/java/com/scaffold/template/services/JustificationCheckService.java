package com.scaffold.template.services;

import com.scaffold.template.models.JustificationCheck;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface JustificationCheckService{
    JustificationCheck createCheck(JustificationCheck check, Long userId);
    JustificationCheck updateCheck(JustificationCheck check, Long userId);
    boolean deleteCheck(Long checkId, Long userId);
    JustificationCheck getCheckById(Long checkId);
    Page<JustificationCheck> getChecksPaged(int page, int size, Long employeeId);

    JustificationCheck getCheckByJustificationId(Long justificationId);

    Page<JustificationCheck> getChecksPagedByUserId(int page, int size, Long userId);
}
