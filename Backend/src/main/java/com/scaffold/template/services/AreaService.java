package com.scaffold.template.services;

import com.scaffold.template.models.Area;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AreaService {
    public Area getArea(Long areaId);
    public List<Area> getAreas();
    public Area createArea(Area area, Long userId);
    public boolean deleteArea(Long areaId, Long userId);
    public Area updateArea(Area area, Long userId);
    public boolean areaResponsibleExists(Long responsibleId);
    public Area getAreaByResponsible(Long responsibleId);
    Page<Area> getAreasPaged(int page, int size);
}
