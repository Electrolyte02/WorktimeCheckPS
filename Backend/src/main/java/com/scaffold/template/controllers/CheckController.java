package com.scaffold.template.controllers;

import com.scaffold.template.entities.JustificationCheckEntity;
import com.scaffold.template.models.JustificationCheck;
import com.scaffold.template.services.JustificationCheckService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/check")
public class CheckController {
    @Autowired
    private JustificationCheckService justificationCheckService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @PostMapping("")
    public ResponseEntity<JustificationCheck> createJustificationCheck(@RequestHeader("X-User-Id") Long userId,
            @RequestBody JustificationCheck justificationCheck){
        JustificationCheck createdCheck = justificationCheckService.createCheck(justificationCheck, userId);
        return ResponseEntity.ok(createdCheck);
    }

    @GetMapping("/view/{justificationId}")
    public ResponseEntity<JustificationCheck> getCheckByJustificationId(@RequestHeader("X-User-Id") Long userId,
            @PathVariable Long justificationId){
        JustificationCheck check = justificationCheckService.getCheckByJustificationId(justificationId);
        return ResponseEntity.ok(check);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<JustificationCheck>> getChecksPagedByEmployee(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = true) Long employeeId
    ) {
        Page<JustificationCheck> checkPage = justificationCheckService.getChecksPaged(page, size, employeeId);
        return ResponseEntity.ok(checkPage);
    }

    @GetMapping("/paged/my")
    public ResponseEntity<Page<JustificationCheck>> getChecksPagedByUser(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        Page<JustificationCheck> checkPage = justificationCheckService.getChecksPagedByUserId(page, size, userId);
        return ResponseEntity.ok(checkPage);
    }
}
