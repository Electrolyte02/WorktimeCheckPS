package com.scaffold.template.services.impl;

import com.scaffold.template.entities.AreaEntity;
import com.scaffold.template.models.Area;
import com.scaffold.template.repositories.AreaRepository;
import com.scaffold.template.services.AreaService;
import com.scaffold.template.services.UserService;
import jakarta.persistence.EntityExistsException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AreaServiceImpl implements AreaService {
    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @Override
    public Area getArea(Long areaId) {
        Optional<AreaEntity> areaEntity = areaRepository.findById(areaId);
        return areaEntity.map(entity -> mapper.map(entity, Area.class)).orElse(null);
    }

    @Override
    public List<Area> getAreas() {
        List<AreaEntity> entities = areaRepository.findAll();
        List<Area> areas = new ArrayList<>();
        for (AreaEntity e : entities){
            if (e.getState()==1L){
                areas.add(mapper.map(e,Area.class));
            }
        }
        return areas;
    }

    @Override
    public Area createArea(Area area, Long userId) {
        Optional<AreaEntity> areaEntity = areaRepository.findByDescription(area.getDescription());
        if (areaEntity.isPresent()){
            throw new EntityExistsException("The area already exists");
        }
        if (areaResponsibleExists(area.getAreaResponsible())){
            throw new EntityExistsException("There is already an area assigned to that user");
        }
        area.setState(1L);
        area.setUser(userId);
        userService.updateUserRole(area.getAreaResponsible(), "MANAGER");
        AreaEntity createdEntity = areaRepository.save(mapper.map(area, AreaEntity.class));
        return mapper.map(createdEntity, Area.class);
    }

    @Override
    public boolean deleteArea(Long areaId, Long userId) {
        Optional<AreaEntity> areaEntity = areaRepository.findById(areaId);
        if (areaEntity.isPresent()){
            areaEntity.get().setState(0L);
            areaEntity.get().setId(userId);
            areaRepository.save(areaEntity.get());
            return true;
        }
        return false;
    }

    @Override
    public Area updateArea(Area area, Long userId) {
        Optional<AreaEntity> areaEntity = areaRepository.findById(area.getId());
        if (areaResponsibleExists(area.getAreaResponsible())){
            throw new EntityExistsException("There is already an area assigned to that user");
        }
        if (areaEntity.isPresent()){
            if (areaEntity.get().getAreaResponsible() == null){
                userService.updateUserRole(area.getAreaResponsible(), "MANAGER");
            }
            else if (!Objects.equals(area.getAreaResponsible(), areaEntity.get().getAreaResponsible())){
                userService.updateUserRole(areaEntity.get().getAreaResponsible(), "EMPLOYEE");
                userService.updateUserRole(area.getAreaResponsible(), "MANAGER");
            }
            AreaEntity areaToSave = mapper.map(area, AreaEntity.class);
            areaToSave.setId(areaEntity.get().getId());
            areaToSave.setUser(userId);
            areaRepository.save(areaToSave);
            return mapper.map(areaToSave,Area.class);
        }
        return null;
    }

    @Override
    public boolean areaResponsibleExists(Long responsibleId) {
        Optional<AreaEntity> areaEntity = areaRepository.findByAreaResponsible(responsibleId);
        return areaEntity.isPresent();
    }

    @Override
    public Area getAreaByResponsible(Long responsibleId) {
        Optional<AreaEntity> areaEntity = areaRepository.findByAreaResponsible(responsibleId);
        return areaEntity.map(entity -> mapper.map(entity, Area.class)).orElse(null);
    }

    @Override
    public Page<Area> getAreasPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AreaEntity> areaPage = areaRepository.findAll(pageable);
        return areaPage.map(areaEntity -> mapper.map(areaEntity, Area.class));
    }
}
