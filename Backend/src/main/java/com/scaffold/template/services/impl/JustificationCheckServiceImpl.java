package com.scaffold.template.services.impl;

import com.scaffold.template.entities.JustificationCheckEntity;
import com.scaffold.template.entities.TimeJustificationEntity;
import com.scaffold.template.models.Employee;
import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.models.JustificationCheck;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.repositories.JustificationCheckRepository;
import com.scaffold.template.services.EmployeeService;
import com.scaffold.template.services.EmployeeTimeService;
import com.scaffold.template.services.JustificationCheckService;
import com.scaffold.template.services.TimeJustificationService;
import org.apache.commons.lang3.NotImplementedException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JustificationCheckServiceImpl implements JustificationCheckService {
    @Autowired
    private JustificationCheckRepository checkRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TimeJustificationService timeJustificationService;

    @Autowired
    private EmployeeTimeService timeService;

    @Autowired
    private EmailServiceImpl emailService;

    @Override
    public JustificationCheck createCheck(JustificationCheck check, Long userId) {
        TimeJustification justification = timeJustificationService.getTimeJustificationById(check.getJustificationId());
        if (justification==null){
            throw new RuntimeException("Justification doesn't exist");
        }
        check.setCheckState(1L);
        timeJustificationService.changeJustificationState(check.getJustificationId(), check.getCheckApproval());
        JustificationCheckEntity entity = modelMapper.map(check, JustificationCheckEntity.class);
        entity.setCheckAudUser(userId);
        JustificationCheckEntity savedEntity = checkRepository.save(entity);

        EmployeeTime time = timeService.getEmployeeTimeById(justification.getTimeId());
        Employee manager = employeeService.getEmployeeManagerByEmployee(time.getEmployeeId());
        emailService.notifyEmployeeAboutJustificationDecision(time.getEmployeeId(), manager.getEmployeeId(), justification, check);
        return modelMapper.map(savedEntity, JustificationCheck.class);
    }

    @Override
    public JustificationCheck updateCheck(JustificationCheck check, Long userId) {
        TimeJustification justification = timeJustificationService.getTimeJustificationById(check.getJustificationId());
        if (justification==null){
            throw new RuntimeException("Justification doesn't exist");
        }
        Optional<JustificationCheckEntity> checkEntity = checkRepository.findById(check.getJustificationId());
        if (checkEntity.isPresent()){
            checkEntity.get().setCheckApproval(check.getCheckApproval());
            checkEntity.get().setCheckReason(check.getCheckReason());
            checkEntity.get().setCheckAudUser(userId);
            checkRepository.save(checkEntity.get());
            return modelMapper.map(checkEntity.get(), JustificationCheck.class);
        }
        return null;
    }

    @Override
    public boolean deleteCheck(Long checkId, Long userId) {
        Optional<JustificationCheckEntity> checkEntity = checkRepository.findById(checkId);
        if (checkEntity.isPresent()){
            checkEntity.get().setCheckState(0L);
            checkEntity.get().setCheckAudUser(userId);
            checkRepository.save(checkEntity.get());
            return true;
        }
        return false;
    }

    @Override
    public JustificationCheck getCheckById(Long checkId) {
        Optional<JustificationCheckEntity> checkEntity = checkRepository.findById(checkId);
        if (checkEntity.isPresent()){
            return modelMapper.map(checkEntity, JustificationCheck.class);
        }
        return null;
    }

    @Override
    public Page<JustificationCheck> getChecksPaged(int page, int size, Long employeeId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<JustificationCheckEntity> checkPage;

        if (employeeId!=null){
            checkPage = checkRepository.findByEmployeeId(employeeId, pageable);
        }
        else {
            checkPage = checkRepository.findAll(pageable);
        }

        return checkPage.map(justificationCheckEntity ->
                modelMapper.map(justificationCheckEntity, JustificationCheck.class));
    }

    @Override
    public JustificationCheck getCheckByJustificationId(Long justificationId) {
        JustificationCheckEntity checkEntity = checkRepository.findByJustificationId(justificationId);
        if (checkEntity == null){
            return null;
        }
        return modelMapper.map(checkEntity, JustificationCheck.class);
    }

    @Override
    public Page<JustificationCheck> getChecksPagedByUserId(int page, int size, Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);
        Pageable pageable = PageRequest.of(page, size);

        Page<JustificationCheckEntity> checkPage = checkRepository.findByEmployeeId(employee.getEmployeeId(), pageable);

        return checkPage.map(justificationCheckEntity ->
                modelMapper.map(justificationCheckEntity, JustificationCheck.class));
    }
}
