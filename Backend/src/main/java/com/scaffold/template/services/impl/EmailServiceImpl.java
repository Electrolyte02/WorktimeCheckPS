package com.scaffold.template.services.impl;

import com.scaffold.template.dtos.EmailRequest;
import com.scaffold.template.dtos.EmailResponse;
import com.scaffold.template.entities.EmailTemplate;
import com.scaffold.template.models.Employee;
import com.scaffold.template.models.JustificationCheck;
import com.scaffold.template.models.Notification;
import com.scaffold.template.models.TimeJustification;
import com.scaffold.template.repositories.EmailTemplateRepository;
import com.scaffold.template.services.NotificationService;
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

    @Autowired
    private NotificationService notificationService;

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

    public EmailResponse sendEmailToEmployee(Long employeeId, String templateName, Map<String, Object> additionalVariables) {
        Employee employee = employeeService.getEmployee(employeeId);

        if (employee==null){
            throw new RuntimeException("Employee not found: " + employeeId);
        }

        Map<String, Object> variables = additionalVariables != null ? new HashMap<>(additionalVariables) : new HashMap<>();

        EmailRequest request = new EmailRequest(templateName, employee.getEmployeeEmail(), variables);

        Notification notification = new Notification();
        notification.setNotificationSentstatus(false);
        notification.setNotificationSender(fromEmail);
        notification.setNotificationReceiver(employee.getEmployeeEmail());
        notification.setNotificationSubject(templateName);
        notification  = notificationService.createNotification(notification, employeeId);

        EmailResponse response = sendTemplatedEmail(request);

        if (response.success()) {
            notificationService.updateNotification(notification, employeeId, true);
        }

        return response;
    }

    public List<EmailResponse> sendBulkEmails(String templateName, List<Long> employeeIds, Map<String, Object> commonVariables) {
        return employeeIds.stream()
                .map(id -> sendEmailToEmployee(id, templateName, commonVariables))
                .collect(Collectors.toList());
    }

    public EmailResponse sendRegisteredEmail(Long employeeId) {
        Map<String, Object> variables = new HashMap<>();
        Employee employee = employeeService.getEmployee(employeeId);

        variables.put("employeeFirstName",employee.getEmployeeName());
        variables.put("employeeDepartment", employee.getEmployeeArea().getDescription());
        return sendEmailToEmployee(employeeId, "welcome", variables);
    }

    public EmailResponse sendRegistrationEmail(Long employeeId, String registrationUrl) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("registrationUrl", registrationUrl);

        Employee employee = employeeService.getEmployee(employeeId);

        variables.put("employeeName",employee.getEmployeeName()+ " "+ employee.getEmployeeLastName());
        variables.put("employeeDepartment", employee.getEmployeeArea().getDescription());
        variables.put("employeeEmail", employee.getEmployeeEmail());

        return sendEmailToEmployee(employeeId, "employee_registration", variables);
    }

    public EmailResponse notifyManagerAboutJustification(Long managerId, Long employeeId,
                                                         TimeJustification justification) {
        try {
            // Obtener datos del empleado que hizo la justificación
            Employee employee = employeeService.getEmployee(employeeId);
            if (employee == null) {
                throw new RuntimeException("Employee not found: " + employeeId);
            }

            // Obtener datos del gerente
            Employee manager = employeeService.getEmployee(managerId);
            if (manager == null) {
                throw new RuntimeException("Manager not found: " + managerId);
            }

            Map<String, Object> variables = new HashMap<>();

            // Datos del empleado
            variables.put("employeeName", employee.getEmployeeName() + " " + employee.getEmployeeLastName());
            variables.put("employeeFirstName", employee.getEmployeeName());
            variables.put("employeeLastName", employee.getEmployeeLastName());
            variables.put("employeeDepartment", employee.getEmployeeArea().getDescription());
            variables.put("employeeEmail", employee.getEmployeeEmail());

            // Datos del gerente
            variables.put("managerName", manager.getEmployeeName() + " " + manager.getEmployeeLastName());

            // Datos de la justificación
            variables.put("justificationDate", LocalDateTime.now());
            variables.put("justificationReason", justification.getJustificationObservation());

            EmailRequest request = new EmailRequest("manager_justification_notification",
                    manager.getEmployeeEmail(), variables);

            Notification notification = new Notification();
            notification.setNotificationSentstatus(false);
            notification.setNotificationSender(fromEmail);
            notification.setNotificationReceiver(manager.getEmployeeEmail());
            notification.setNotificationSubject("manager_justification_notification");
            notification = notificationService.createNotification(notification, employeeId);

            EmailResponse response = sendTemplatedEmail(request);

            if (response.success()) {
                notificationService.updateNotification(notification, employeeId, true);
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new EmailResponse(false, "Error al notificar al gerente: " + e.getMessage(),
                    "manager_justification_notification");
        }
    }

    public EmailResponse notifyEmployeeAboutJustificationDecision(Long employeeId, Long managerId,
                                                                  TimeJustification justification,
                                                                  JustificationCheck check) {
        try {
            // Obtener datos del empleado
            Employee employee = employeeService.getEmployee(employeeId);
            if (employee == null) {
                throw new RuntimeException("Employee not found: " + employeeId);
            }

            // Obtener datos del gerente
            Employee manager = employeeService.getEmployee(managerId);
            if (manager == null) {
                throw new RuntimeException("Manager not found: " + managerId);
            }

            Map<String, Object> variables = new HashMap<>();

            // Datos del empleado
            variables.put("employeeName", employee.getEmployeeName() + " " + employee.getEmployeeLastName());
            variables.put("employeeFirstName", employee.getEmployeeName());
            variables.put("employeeLastName", employee.getEmployeeLastName());
            variables.put("employeeDepartment", employee.getEmployeeArea().getDescription());
            variables.put("employeeEmail", employee.getEmployeeEmail());

            // Datos del gerente
            variables.put("managerName", manager.getEmployeeName() + " " + manager.getEmployeeLastName());

            // Datos de la justificación
            variables.put("justificationDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))+ " a las "+ LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:ss")));
            variables.put("justificationReason", justification.getJustificationObservation());
            variables.put("decisionDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

            // Estado de la justificación
            variables.put("justificationStatus", check.getCheckApproval() ? "APROBADA" : "RECHAZADA");
            variables.put("justificationStatusClass", check.getCheckApproval() ? "approved" : "rejected");
            variables.put("justificationStatusIcon", check.getCheckApproval() ? "✅" : "❌");
            variables.put("statusMessage", check.getCheckApproval() ? "✅ Tu justificación ha sido APROBADA" : "❌ Tu justificación ha sido RECHAZADA");

            // Comentarios del gerente (opcional)
            if (check.getCheckReason() != null && !check.getCheckReason().trim().isEmpty()) {
                variables.put("managerCommentsSection",
                        "<div class=\"manager-comments\">" +
                                "<h4>Comentarios del supervisor:</h4>" +
                                "<p>\"" + check.getCheckReason() + "\"</p>" +
                                "</div>");
                variables.put("managerCommentsText",
                        "COMENTARIOS DEL SUPERVISOR:\n\"" + check.getCheckReason() + "\"\n");
            } else {
                variables.put("managerCommentsSection", "");
                variables.put("managerCommentsText", "");
            }

            // Mensaje condicional según el estado
            if (check.getCheckApproval()) {
                variables.put("decisionMessage",
                        "<p>Tu justificación ha sido aprobada. Los cambios se reflejarán automáticamente en tu registro de horarios.</p>" +
                                "<p>Si tienes alguna duda sobre esta decisión, puedes contactar a tu supervisor directo.</p>");
                variables.put("decisionMessageText",
                        "Tu justificación ha sido aprobada. Los cambios se reflejarán automáticamente en tu registro de horarios.\n\n" +
                                "Si tienes alguna duda sobre esta decisión, puedes contactar a tu supervisor directo.");
            } else {
                variables.put("decisionMessage",
                        "<p>Lamentamos informarte que tu justificación no ha sido aprobada. Si consideras que hay información adicional que debería ser considerada, puedes:</p>" +
                                "<ul>" +
                                "<li>Contactar directamente a tu supervisor</li>" +
                                "<li>Consultar con el departamento de Recursos Humanos</li>" +
                                "</ul>");
                variables.put("decisionMessageText",
                        "Lamentamos informarte que tu justificación no ha sido aprobada. Si consideras que hay información adicional que debería ser considerada, puedes:\n\n" +
                                "• Contactar directamente a tu supervisor\n" +
                                "• Consultar con el departamento de Recursos Humanos");
            }

            EmailRequest request = new EmailRequest("employee_justification_decision",
                    employee.getEmployeeEmail(), variables);

            Notification notification = new Notification();
            notification.setNotificationSentstatus(false);
            notification.setNotificationSender(fromEmail);
            notification.setNotificationReceiver(employee.getEmployeeEmail());
            notification.setNotificationSubject("employee_justification_decision");
            notification = notificationService.createNotification(notification, managerId);

            EmailResponse response = sendTemplatedEmail(request);

            if (response.success()) {
                notificationService.updateNotification(notification, managerId, true);
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return new EmailResponse(false, "Error al notificar al empleado: " + e.getMessage(),
                    "employee_justification_decision");
        }
    }

}
