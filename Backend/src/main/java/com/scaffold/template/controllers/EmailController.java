package com.scaffold.template.controllers;

import com.scaffold.template.dtos.EmailRequest;
import com.scaffold.template.dtos.EmailResponse;
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

    @PostMapping("/test")
    public ResponseEntity<EmailResponse> sendMail(){
        EmailRequest request= new EmailRequest("welcome","elwachomacr@gmail.com",new HashMap<>());

        return ResponseEntity.ok(emailService.sendTemplatedEmail(request));
    }

}
