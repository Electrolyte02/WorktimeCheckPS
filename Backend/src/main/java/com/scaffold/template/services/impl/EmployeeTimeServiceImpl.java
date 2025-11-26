package com.scaffold.template.services.impl;

import com.scaffold.template.entities.EmployeeEntity;
import com.scaffold.template.entities.EmployeeTimeEntity;
import com.scaffold.template.models.Area;
import com.scaffold.template.models.Employee;
import com.scaffold.template.models.EmployeeTime;
import com.scaffold.template.repositories.EmployeeTimeRepository;
import com.scaffold.template.services.AreaService;
import com.scaffold.template.services.EmployeeService;
import com.scaffold.template.services.EmployeeTimeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeTimeServiceImpl implements EmployeeTimeService {

    @Autowired
    private EmployeeTimeRepository timeRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public Page<EmployeeTime> getEmployeeTimesByEmployee(int page, int size, Long employeeId, Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);

        if (employeeId==null && areaService.areaResponsibleExists(employee.getEmployeeId())){
            return this.getEmployeeTimesByArea(page, size, employee.getEmployeeId());
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeTimeEntity> timePage;
        if (employeeId == null) {
            timePage = timeRepository.findAll(pageable);
        }
        else {
            timePage = timeRepository.searchByEmployeeId(employeeId, pageable);
        }
        return timePage.map(employeeTimeEntity -> modelMapper.map(employeeTimeEntity, EmployeeTime.class));
    }

    @Override
    public EmployeeTime updateEmployeeTime(EmployeeTime employeeTime) {
        Optional<EmployeeTimeEntity> timeEntity = timeRepository.findById(employeeTime.getTimeId());
        if (timeEntity.isPresent()){
            timeEntity.get().setTimeState(employeeTime.getTimeState());
            return modelMapper.map(timeRepository.save(timeEntity.get()),EmployeeTime.class);
        }
        return null;
    }

    @Override
    public boolean deleteEmployeeTime(Long timeId) {
        boolean auxReturn = false;
        Optional<EmployeeTimeEntity> timeEntity = timeRepository.findById(timeId);
        if (timeEntity.isPresent()){
            timeEntity.get().setTimeState(0L);
            timeRepository.save(timeEntity.get());
            auxReturn = true;
        }
        return auxReturn;
    }

    @Override
    public EmployeeTime getEmployeeTimeById(Long id) {
        Optional<EmployeeTimeEntity> timeEntity = timeRepository.findById(id);
        if (timeEntity.isPresent()){
            return modelMapper.map(timeEntity,EmployeeTime.class);
        }
        return null;
    }

    @Override
    public Page<EmployeeTime> getEmployeeTimesByUserId(int page, int size, Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);
        Pageable pageable = PageRequest.of(page, size);

        Page<EmployeeTimeEntity> timePage = timeRepository.searchByEmployeeId(employee.getEmployeeId(), pageable);
        return timePage.map(employeeTimeEntity -> modelMapper.map(employeeTimeEntity, EmployeeTime.class));
    }

    @Override
    public Page<EmployeeTime> getEmployeeTimesByArea(int page, int size, Long employeeId) {
        Pageable pageable = PageRequest.of(page, size);

        Area area = areaService.getAreaByResponsible(employeeId);

        Page<EmployeeTimeEntity> timePage = timeRepository.findByAreaId(area.getId(), pageable);

        return timePage.map(employeeTimeEntity -> modelMapper.map(employeeTimeEntity, EmployeeTime.class));
    }
}
