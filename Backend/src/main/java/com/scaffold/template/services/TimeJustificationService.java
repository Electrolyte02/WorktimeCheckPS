package com.scaffold.template.services;

import com.scaffold.template.dtos.EmployeeJustificationDto;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.dtos.TimeJustificationDto;
import io.minio.errors.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public interface TimeJustificationService {
    TimeJustification createTimeJustification(TimeJustification justification, MultipartFile file, Long userId) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException;
    TimeJustification updateTimeJustification(TimeJustification justification, MultipartFile file, Long userId) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException;
    boolean deleteTimeJustification(TimeJustification justification, Long userId);
    TimeJustificationDto getTimeJustification(Long justificationId) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException;
    Page<EmployeeJustificationDto> getJustificationsPaged(int page, int size, Long employeeId);
    TimeJustification changeJustificationState(Long justificationId, boolean approved);
    TimeJustification getTimeJustificationById(Long justificationId);
    Page<EmployeeJustificationDto> getJustificationsPagedByUser(int page, int size, Long userId);
}
