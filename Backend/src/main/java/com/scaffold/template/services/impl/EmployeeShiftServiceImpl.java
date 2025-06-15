package com.scaffold.template.services.impl;

import com.scaffold.template.entities.EmployeeShiftEntity;
import com.scaffold.template.models.EmployeeShift;
import com.scaffold.template.repositories.EmployeeShiftRepository;
import com.scaffold.template.services.EmployeeShiftService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeShiftServiceImpl implements EmployeeShiftService {
    @Autowired
    private EmployeeShiftRepository shiftRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<EmployeeShift> getEmployeeShiftsByEmployee(Long employeeId) {
        List<EmployeeShiftEntity> shiftEntities = shiftRepository.findAllByEmployeeId(employeeId);
        List<EmployeeShift> shifts = new ArrayList<>();
        for (EmployeeShiftEntity s : shiftEntities){
            if (s.getShiftState() != 0L)
                shifts.add(modelMapper.map(s,EmployeeShift.class));
        }
        return shifts;
    }

    @Override
    public EmployeeShift createShift(EmployeeShift shift, Long userId) {
        EmployeeShiftEntity auxEntity = modelMapper.map(shift,EmployeeShiftEntity.class);
        auxEntity.setShiftId(null);
        auxEntity.setShiftAudUser(userId);
        auxEntity.setShiftState(1L);
        shiftRepository.save(auxEntity);
        return modelMapper.map(auxEntity,EmployeeShift.class);
    }

    @Override
    public EmployeeShift updateShift(EmployeeShift shift, Long userId) {
        Optional<EmployeeShiftEntity> entity = shiftRepository.findById(shift.getShiftId());
        if (entity.isPresent()){
            EmployeeShiftEntity shiftEntity = modelMapper.map(shift, EmployeeShiftEntity.class);
            shiftEntity.setShiftDay(shift.getShiftDay());
            shiftEntity.setEmployeeId(shift.getEmployeeId());
            shiftEntity.setShiftAudUser(userId);
            return modelMapper.map(shiftRepository.save(shiftEntity), EmployeeShift.class);
        }
        return null;
    }

    @Override
    public boolean deleteShift(Long shiftId, Long userId) {
        boolean auxReturn = false;
        Optional<EmployeeShiftEntity> entity = shiftRepository.findById(shiftId);
        if (entity.isPresent()){
            entity.get().setShiftState(0L);
            entity.get().setShiftAudUser(userId);
            shiftRepository.save(entity.get());
            auxReturn = true;
        }
        return auxReturn;
    }

    @Override
    public boolean deleteShiftsByEmployee(Long employeeId, Long userId) {
        boolean auxReturn = false;
        List<EmployeeShiftEntity> entity = shiftRepository.findAllByEmployeeId(employeeId);
        for (EmployeeShiftEntity s : entity) {
            s.setShiftState(0L);
            s.setShiftAudUser(userId);
            shiftRepository.save(s);
            auxReturn = true;
        }
        return auxReturn;
    }
}
