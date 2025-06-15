package com.scaffold.template.controllers;

import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.dtos.TimeJustificationDto;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.services.TimeJustificationService;
import io.minio.errors.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/justification")
public class TimeJustificationController {
    @Autowired
    private TimeJustificationService justificationService;

    @Autowired
    @Qualifier("modelMapper")
    private ModelMapper mapper;

    @PostMapping("")
    public ResponseEntity<TimeJustification> createTimeJustification(
            @RequestHeader("X-User-Id") Long userId,
            @RequestPart("justification") TimeJustificationDto justificationDto,
            @RequestPart("file") MultipartFile file)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException
    {
        TimeJustification createdJustification = justificationService.createTimeJustification(mapper.map(justificationDto, TimeJustification.class), file, userId);
        return ResponseEntity.ok(createdJustification);
    }

    @GetMapping("/{justificationId}")
    public ResponseEntity<TimeJustificationDto> getJustification(@PathVariable Long justificationId)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException
    {
        TimeJustificationDto dto = justificationService.getTimeJustification(justificationId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<EmployeeJustificationDto>> getTimeJustificationsPaged(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long employeeId)
    {
        Page<EmployeeJustificationDto> paged = justificationService.getJustificationsPaged(page, size, employeeId);
        return ResponseEntity.ok(paged);
    }

    @GetMapping("/paged/my")
    public ResponseEntity<Page<EmployeeJustificationDto>> getTimeJustificationsPagedByUser(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size)
    {
        Page<EmployeeJustificationDto> paged = justificationService.getJustificationsPagedByUser(page, size, userId);
        return ResponseEntity.ok(paged);
    }

}
