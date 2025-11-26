package com.scaffold.template.controllers;

import com.scaffold.template.dtos.EmailRequest;
import com.scaffold.template.dtos.EmailResponse;
import com.scaffold.template.services.JustificationCheckService;
import com.scaffold.template.services.TimeJustificationService;
import com.scaffold.template.services.impl.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/mails")
public class EmailController {
    @Autowired
    private EmailServiceImpl emailService;


    @Autowired
    private JustificationCheckService justificationService;

    @Autowired
    private TimeJustificationService timeJustificationService;

    @PostMapping("/test")
    public ResponseEntity<EmailResponse> sendMail(){
        //EmailRequest request= new EmailRequest("welcome","elwachomacr@gmail.com",new HashMap<>());

        return ResponseEntity.ok(emailService.notifyEmployeeAboutJustificationDecision(1L,1L,
                timeJustificationService.getTimeJustificationById(2L),
                justificationService.getCheckById(1L)));
    }

}
