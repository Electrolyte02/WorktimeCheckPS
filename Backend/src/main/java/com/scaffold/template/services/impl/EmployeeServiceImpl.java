package com.scaffold.template.services.impl;

import com.scaffold.template.dtos.EmployeeDto;
import com.scaffold.template.dtos.EmployeeShiftDto;
import com.scaffold.template.entities.AreaEntity;
import com.scaffold.template.entities.EmployeeEntity;
import com.scaffold.template.models.Employee;
import com.scaffold.template.models.EmployeeShift;
import com.scaffold.template.repositories.AreaRepository;
import com.scaffold.template.repositories.EmployeeRepository;
import com.scaffold.template.services.EmployeeService;
import com.scaffold.template.services.EmployeeShiftService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeShiftService shiftService;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private ModelMapper modelMapper;



    @Override
    public Employee getEmployee(Long id) {
        Optional<EmployeeEntity> entity = employeeRepository.findById(id);
        if (entity.isPresent()) {
            Employee employee = modelMapper.map(entity.get(),Employee.class);
            List<EmployeeShift> shiftEntities = shiftService.getEmployeeShiftsByEmployee(employee.getEmployeeId());
            employee.setEmployeeShifts(shiftEntities);
            return employee;
        }
        return null;
    }

    @Override
    public List<EmployeeDto> getEmployeeList() {
        List<EmployeeEntity> employeeEntities = employeeRepository.findAll();
        List<Employee> auxReturn = new ArrayList<Employee>();
        for (EmployeeEntity e : employeeEntities){
            if (e.getEmployeeState() == 1L) {
                auxReturn.add(modelMapper.map(e,Employee.class));
            }
        }
        return auxReturn.stream().map(e -> modelMapper.map(e, EmployeeDto.class)).toList();
    }

    @Override
    public Employee createEmployee(EmployeeDto employeeDto, Long userId) {
        EmployeeEntity auxEntity = (modelMapper.map(employeeDto,EmployeeEntity.class));
        auxEntity.setAuditUser(userId);
        auxEntity.setEmployeeState(1L);
        auxEntity.setEmployeeArea(new AreaEntity(1L,"C",1L,1L,1L));
        auxEntity = employeeRepository.save(auxEntity);
        for (EmployeeShiftDto s : employeeDto.getEmployeeShifts()){
            s.setEmployeeId(auxEntity.getEmployeeId());
            shiftService.createShift(modelMapper.map(s, EmployeeShift.class), userId);
        }
        //emailService.sendRegistrationEmail(auxEntity.getEmployeeId(), "http://localhost:4200/");
        return modelMapper.map(auxEntity,Employee.class);
    }

    @Override
    public Employee updateEmployee(EmployeeDto employeeDto, Boolean changeTime, Long userId) {
        Optional<EmployeeEntity> entity = employeeRepository.findById(employeeDto.getEmployeeId());
        if (entity.isPresent()) {
            EmployeeEntity employeeEntity = modelMapper.map(employeeDto, EmployeeEntity.class);
            employeeEntity.setEmployeeId(employeeDto.getEmployeeId());
            employeeEntity.setAuditUser(userId);
            employeeEntity.setEmployeeState(1L);
            employeeRepository.save(employeeEntity);
            if (changeTime) {
                shiftService.deleteShiftsByEmployee(entity.get().getEmployeeId(), userId);
                for (EmployeeShiftDto s : employeeDto.getEmployeeShifts()) {
                    shiftService.createShift(modelMapper.map(s, EmployeeShift.class), userId);
                }
            }
            return modelMapper.map(entity.get(), Employee.class);
        }
        return null;
    }

    @Override
    public boolean deleteEmployee(Long employeeId, Long userId) {
        boolean auxReturn = false;
        Optional<EmployeeEntity> entity = employeeRepository.findById(employeeId);
        if (entity.isPresent()) {
            EmployeeEntity auxEntity = entity.get();
            auxEntity.setAuditUser(userId);
            auxEntity.setEmployeeState(0L);
            employeeRepository.save(auxEntity);
            auxReturn = true;
        }
        return auxReturn;
    }

    @Override
    public Page<EmployeeDto> getEmployeesPaged(int page, int size, String search, Long userId) {
        Employee employee = this.getEmployeeByUserId(userId);

        if (areaRepository.existsByAreaResponsible(employee.getEmployeeId())){
            return this.getEmployeesPagedByArea(page, size,search, userId);
        }

        Pageable pageable = PageRequest.of(page, size);


        Page<EmployeeEntity> employeePage;

        if (search == null || search.isBlank()) {
            employeePage = employeeRepository.findAll(pageable);
        } else {
            employeePage = employeeRepository.searchByName(search.toLowerCase(), pageable);
        }

        return employeePage.map(entity -> modelMapper.map(entity, EmployeeDto.class));
    }

    @Override
    public Page<EmployeeDto> getEmployeesPagedByArea(int page, int size,String search ,Long userId) {
        Optional<EmployeeEntity> responsible = employeeRepository.findByUserId(userId);
        if (responsible.isEmpty()){
            throw new IllegalArgumentException("The user isn't registered to an employee");
        }

        Optional<AreaEntity> area = areaRepository.findByAreaResponsible(responsible.get().getEmployeeId());
        if (area.isEmpty()){
            throw new IllegalArgumentException("The user isn't responsible of an area");
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<EmployeeEntity> employeePage;
        if (search == null || search.isBlank()) {
            employeePage = employeeRepository.findByAreaId(area.get().getId(), pageable);
        }
        else {
            employeePage = employeeRepository.searchByAreaId(area.get().getId(), search,pageable);
        }

        return employeePage.map(entity -> modelMapper.map(entity, EmployeeDto.class));
    }

    @Override
    public Employee getEmployeeByEmail(String employeeEmail) {
        Optional<EmployeeEntity> entity = employeeRepository.findByEmail(employeeEmail);

        return entity.map(employeeEntity -> modelMapper.map(employeeEntity, Employee.class)).orElse(null);
    }

    @Override
    public Employee getEmployeeByUserId(Long userId) {
        Optional<EmployeeEntity> entity = employeeRepository.findByUserId(userId);
        return entity.map(employeeEntity -> modelMapper.map(employeeEntity, Employee.class)).orElse(null);
    }

    @Override
    public Employee getEmployeeManagerByEmployee(Long employeeId) {
        Optional<EmployeeEntity> entity = employeeRepository.findById(employeeId);
        if (entity.isPresent()){
            Optional<AreaEntity> area = areaRepository.findById(entity.get().getEmployeeArea().getId());
            Optional<EmployeeEntity> manager = employeeRepository.findById(area.get().getAreaResponsible());
            return modelMapper.map(manager,Employee.class);
        }
        return null;
    }

}
