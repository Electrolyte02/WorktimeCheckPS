package com.scaffold.template.controllers;

import com.scaffold.template.models.Area;
import com.scaffold.template.services.AreaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Angular default port
@RequestMapping("/areas")
public class AreaController {
    @Autowired
    private AreaService areaService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @GetMapping("")
    public ResponseEntity<List<Area>> getAreas() {
        List<Area> areas = areaService.getAreas();
        if (!areas.isEmpty()) {
            return ResponseEntity.ok(areas);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<Area> createArea(@RequestHeader("X-User-Id") Long userId,
            @RequestBody Area dto){
        Area area = areaService.createArea(dto, userId);
        return ResponseEntity.ok(area);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteArea(@RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id)
    {
        if (areaService.deleteArea(id, userId))
        {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Area> updateArea(@RequestHeader("X-User-Id") Long userId,
            @RequestBody Area dto){
        Area area = areaService.updateArea(dto, userId);
        return ResponseEntity.ok(area);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Area>> getAreasPaged(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        Page<Area> areas = areaService.getAreasPaged(page, size);
        return ResponseEntity.ok(areas);
    }
}
