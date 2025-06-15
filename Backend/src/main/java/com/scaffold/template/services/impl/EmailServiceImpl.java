package com.scaffold.template.services.impl;

import com.scaffold.template.dtos.EmailRequest;
import com.scaffold.template.dtos.EmailResponse;
import com.scaffold.template.entities.EmailTemplate;
import com.scaffold.template.models.Employee;
import com.scaffold.template.repositories.EmailTemplateRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmailServiceImpl {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateRepository templateRepository;

    @Autowired
    private EmployeeServiceImpl employeeService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailResponse sendTemplatedEmail(EmailRequest request) {
        try {
            // Buscar plantilla
            EmailTemplate template = templateRepository
                    .findByNameAndActiveTrue(request.templateName())
                    .orElseThrow(() -> new RuntimeException("Template not found: " + request.templateName()));

            // Buscar empleado por email
            Employee employee = null;
            if (request.recipientEmail() != null && !request.recipientEmail().trim().isEmpty()) {
                employee = employeeService.getEmployeeByEmail(request.recipientEmail());
            }

            // Preparar variables para el template
            Map<String, Object> variables = request.variables() != null ?
                    new HashMap<>(request.variables()) : new HashMap<>();

            // Agregar variables del empleado si existe
            if (employee != null) {
                variables.put("employeeName", employee.getEmployeeName()+ ' ' + employee.getEmployeeLastName());
                variables.put("employeeFirstName", employee.getEmployeeName());
                variables.put("employeeLastName", employee.getEmployeeLastName());
                variables.put("employeeDepartment", employee.getEmployeeArea().getDescription());
                variables.put("employeeEmail", employee.getEmployeeEmail());
            } else {
                // Si no se encuentra el empleado, usar valores por defecto o avisar
                variables.put("employeeName", "Usuario");
                variables.put("employeeFirstName", "Usuario");
                variables.put("employeeLastName", "");
                variables.put("employeeDepartment", "N/A");
                variables.put("employeePosition", "N/A");
                variables.put("employeeEmail", request.recipientEmail());
            }

            // Agregar variables adicionales comunes
            variables.put("currentDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            variables.put("currentYear", String.valueOf(LocalDateTime.now().getYear()));

            // Log para debug (opcional)
            System.out.println("Variables disponibles: " + variables);

            // Procesar plantilla
            String processedSubject = processTemplate(template.getSubject(), variables);
            String processedHtmlContent = processTemplate(template.getHtmlContent(), variables);
            String processedTextContent = processTemplate(template.getTextContent(), variables);

            // Log para debug (opcional)
            System.out.println("Subject procesado: " + processedSubject);
            System.out.println("HTML procesado: " + processedHtmlContent);

            // Enviar email
            sendEmail(request.recipientEmail(), processedSubject, processedHtmlContent, processedTextContent);

            return new EmailResponse(true, "Email enviado exitosamente", template.getName());

        } catch (Exception e) {
            e.printStackTrace(); // Para debug
            return new EmailResponse(false, "Error al enviar email: " + e.getMessage(), request.templateName());
        }
    }

    private void sendEmail(String to, String subject, String htmlContent, String textContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            if (htmlContent != null && !htmlContent.trim().isEmpty()) {
                helper.setText(textContent, htmlContent);
            } else {
                helper.setText(textContent);
            }

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar email", e);
        }
    }

    private String processTemplate(String template, Map<String, Object> variables) {
        if (template == null) return "";

        String processed = template;
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            processed = processed.replace(placeholder, value);
        }
        return processed;
    }

    // Método para enviar email a empleado específico
    public EmailResponse sendEmailToEmployee(Long employeeId, String templateName, Map<String, Object> additionalVariables) {
        Employee employee = employeeService.getEmployee(employeeId);

        if (employee==null){
            throw new RuntimeException("Employee not found: " + employeeId);
        }

        Map<String, Object> variables = additionalVariables != null ? new HashMap<>(additionalVariables) : new HashMap<>();

        EmailRequest request = new EmailRequest(templateName, employee.getEmployeeEmail(), variables);
        return sendTemplatedEmail(request);
    }

    // Método para enviar emails masivos
    public List<EmailResponse> sendBulkEmails(String templateName, List<Long> employeeIds, Map<String, Object> commonVariables) {
        return employeeIds.stream()
                .map(id -> sendEmailToEmployee(id, templateName, commonVariables))
                .collect(Collectors.toList());
    }
}
