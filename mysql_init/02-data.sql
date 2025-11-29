

INSERT INTO AREAS
VALUES(2,1,1,'Finanzas'),
(NULL,1,1,'Tecnología'),
(NULL,1,1,'Ventas');

INSERT INTO EMAIL_TEMPLATES
VALUES('welcome','¡Bienvenido {{employeeName}}!','<html>
 <body>
     <div class="container">
         <div class="header">
             <h1>¡Bienvenido al equipo!</h1>
         </div>
         <div class="content">
             <h2>¡Hola {{employeeFirstName}}!</h2>
             
             <p>Te damos la bienvenida a nuestro equipo en el departamento de <strong>{{employeeDepartment}}</strong>.</p>
             
             <p>¡Esperamos trabajar contigo!</p>
             
             <p>Saludos cordiales,<br>
             El equipo de RRHH</p>
         </div>
     </div>
 </body>
 </html>','"Hola {{employeeFirstName}}! Te damos la bienvenida a nuestro equipo en {{employeeDepartment}}. ¡Esperamos trabajar contigo! - El equipo de RRHH"',1);
 
 INSERT INTO EMAIL_TEMPLATES
 VALUES('employee_registration','¡Bienvenido {{employeeFirstName}}! Ya puedes registrarte en nuestra plataforma','<html>
 <body>
     <div class="container">
         <div class="header">
             <h1>¡Bienvenido a nuestra plataforma!</h1>
         </div>
         <div class="content">
             <h2>Hola {{employeeName}},</h2>
             
             <p>Nos complace informarte que ya puedes registrarte en nuestra plataforma de gestión de horarios.</p>
             
             <div class="details">
                 <h3>Información de tu cuenta:</h3>
                 <p><strong>Nombre:</strong> {{employeeName}}</p>
                 <p><strong>Departamento:</strong> {{employeeDepartment}}</p>
                 <p><strong>Email:</strong> {{employeeEmail}}</p>
             </div>
             
             
             <p>Si tienes alguna duda o problema durante el registro, no dudes en contactar al departamento de Recursos Humanos.</p>
             
             <p>¡Esperamos que disfrutes usando nuestra plataforma!</p>
             
             <p>Saludos cordiales,<br>
             Equipo de Recursos Humanos</p>
         </div>
     </div>
 </body>
 </html>','¡Bienvenido {{employeeFirstName}}!
 
 Nos complace informarte que ya puedes registrarte en nuestra plataforma de gestión de horarios.
 
 INFORMACIÓN DE TU CUENTA:
 • Nombre: {{employeeName}}
 • Departamento: {{employeeDepartment}}
 • Email: {{employeeEmail}}
 
 PASOS PARA REGISTRARTE:
 1. Visita el siguiente enlace: {{registrationUrl}}
 2. Completa tus datos personales
 3. Crea una contraseña segura
 4. Confirma tu registro
 
 Si tienes alguna duda o problema durante el registro, no dudes en contactar al departamento de Recursos Humanos.
 
 ¡Esperamos que disfrutes usando nuestra plataforma!
 
 Saludos cordiales,
 Equipo de Recursos Humanos',1);
 
 INSERT INTO EMAIL_TEMPLATES
 VALUES('manager_justification_notification','Justificación de horario pendiente de revisión - {{employeeName}}','
 <html>
 <body>
     <div class="container">
         <div class="header">
             <h1>Justificación Pendiente de Aprobar/Rechazar</h1>
         </div>
         <div class="content">
             <h2>Estimado/a {{managerName}},</h2>
             
             <div class="details">
                 <h3>Detalles de la Justificación:</h3>
                 <p><strong>Empleado:</strong> {{employeeName}}</p>
                 <p><strong>Departamento:</strong> {{employeeDepartment}}</p>
                 <p><strong>Email:</strong> {{employeeEmail}}</p>
                 <p><strong>Fecha de la justificación:</strong> {{justificationDate}}</p>
                 <p><strong>Motivo:</strong></p>
                 <p style="background-color: #f8f9fa; padding: 10px; border-radius: 3px; font-style: italic;">
                     {{justificationReason}}
                 </p>
             </div>
             
             <p>Por favor, revisa la justificación y toma la acción correspondiente. Puedes aprobarla o rechazarla desde la plataforma.</p>
 
             <p>Saludos cordiales,<br>
             Sistema de Gestión de Horarios</p>
         </div>
     </div>
 </body>
 </html>','JUSTIFICACIÓN DE HORARIO PENDIENTE
 
 Estimado/a {{managerName}},
 
 Tienes una nueva justificación de horario para revisar.
 
 DETALLES DE LA JUSTIFICACIÓN:
 • Empleado: {{employeeName}}
 • Departamento: {{employeeDepartment}}
 • Email: {{employeeEmail}}
 • Fecha de la justificación: {{justificationDate}}
 • Motivo: {{justificationReason}}
 
 Saludos cordiales,
 Sistema de Gestión de Horarios',1);
 
INSERT INTO EMAIL_TEMPLATES
VALUES('employee_justification_decision','Decisión sobre tu justificación de horario - {{justificationStatus}}','
 <html>
 <body>
     <div class="container">
         <div class="header {{justificationStatusClass}}">
             <h1>{{justificationStatusIcon}} Justificación {{justificationStatus}}</h1>
         </div>
         <div class="content">
             <h2>Hola {{employeeFirstName}},</h2>
             
             <div class="status-box {{justificationStatusClass}}">
                 <strong>{{statusMessage}}</strong>
             </div>
             
             <div class="details">
                 <h3>Detalles de tu Justificación:</h3>
                 <p><strong>Fecha:</strong> {{justificationDate}}</p>
                 <p><strong>Tu motivo:</strong></p>
                 <p style="font-style: italic; background-color: #f8f9fa; padding: 8px; border-radius: 3px;">
                     "{{justificationReason}}"
                 </p>
                 <p><strong>Procesada por:</strong> {{managerName}}</p>
                 <p><strong>Fecha de decisión:</strong> {{decisionDate}}</p>
             </div>
             
             {{managerCommentsSection}}
             
             {{decisionMessage}}
             
             <p>Saludos cordiales,<br>
             Equipo de Recursos Humanos</p>
         </div>
     </div>
 </body>
 </html>','DECISIÓN SOBRE TU JUSTIFICACIÓN DE HORARIO
 
 Hola {{employeeFirstName}},
 
 {{statusMessage}}
 
 DETALLES DE TU JUSTIFICACIÓN:
 • Fecha: {{justificationDate}}
 • Tu motivo: {{justificationReason}}
 • Procesada por: {{managerName}}
 • Fecha de decisión: {{decisionDate}}
 
 {{managerCommentsText}}
 
 {{decisionMessageText}}
 
 Saludos cordiales,
 Equipo de Recursos Humanos
 ',1);
 
 INSERT INTO EMPLOYEES
 VALUES('John','Doe','20-12345678-9','elwachomacr@gmail.com',1,1001,1),
('Jane','Smith','20-30123123-2','estebanjparedes@hotmail.com',1,1,2),
('Carlos','Martinez','20-35123123-2','cmartinez@mail.com',1,1003,1),
('Lucía','Gómez','30-35543123-2','lgomez@mail.com',0,1004,1),
('Emily','Johnson','30-38543543-2','ejohnson@mail.com',0,1,2),
('Carlos','Sanchez','20-43434343-3','margarita.garcia.cavazza@gmail.com',1,1,1);

INSERT INTO EMPLOYEE_SHIFTS
VALUES(1,'L','08:00:00','16:00:000',8,1,1),
(1,'M','08:00:00','16:00:00',8,1,1),
(2,'X','09:00:00','17:00:00',8,0,1),
(3,'J','07:30:00','15:30:00',8,1,1),
(3,'V','07:30:00','15:30:00',8,1,1),
(4,'L','10:00:00','18:00:00',8,0,1),
(5,'S','08:00:00','12:00:00',4,1,1),
(6,'L','12:00:00','16:00:00',240,0,1),
(6,'M','12:00:00','16:00:00',240,0,1),
(6,'X','12:00:00','16:00:00',240,0,1),
(6,'L','16:00:00','20:00:00',240,1,1),
(6,'X','10:00:00','14:00:00',240,1,1),
(2,'L','09:00:00','17:00:00',480,1,1),
(2,'M','09:00:00','17:00:00',480,1,1),
(2,'X','09:00:00','17:00:00',480,1,1);

INSERT INTO EMPLOYEE_TIMES
VALUES(1,'13/11/2025 08:00:00','E',1,1,1),
(1,'13/11/2025 16:00:00','S',1,1,1),
(2,'13/11/2025 09:05:00','E',0,1,1),
(2,'13/11/2025 17:00:00','S',1,1,1),
(3,'13/11/2025 07:30:00','E',1,1,1),
(3,'13/11/2025 15:20:00','S',0,1,1),
(5,'17/11/2025 08:02:00','E',0,1,1),
(5,'17/11/2025 12:01:00','S',0,1,1),
(1,'14/11/2025 08:01:00','E',0,1,1),
(1,'14/11/2025 16:00:00','S',1,1,1),
(1,'15/11/2025 08:00:00','E',1,1,1),
(1,'15/11/2025 15:50:00','S',0,1,1),
(2,'14/11/2025 09:00:00','E',1,1,1),
(2,'14/11/2025 17:10:00','S',0,1,1),
(2,'15/11/2025 09:10:00','E',0,1,1),
(2,'15/11/2025 17:00:00','S',1,1,1),
(3,'14/11/2025 07:25:00','E',1,1,1),
(3,'14/11/2025 15:25:00','S',1,1,1),
(3,'15/11/2025 07:40:00','E',0,1,1),
(3,'15/11/2025 15:30:00','S',1,1,1),
(4,'14/11/2025 10:05:00','E',0,1,1),
(4,'14/11/2025 18:10:00','S',0,1,1),
(5,'18/11/2025 08:00:00','E',1,1,1),
(5,'18/11/2025 12:00:00','S',1,1,1),
(5,'19/11/2025 08:15:00','E',0,1,1),
(5,'19/11/2025 12:00:00','S',1,1,1);

INSERT INTO USERS
VALUES('esteban@esteban.com','$2a$10$qQl8GW6S6jXX6HaQVFOtduMqku.VWLlgaER0eApB0AbDZ9oiRO6yG',1,1,'ADMIN',1,'admin',1),
('estebanjparedes@hotmail.com','$2a$10$btAilFiZjlIZZ5sxemBjC.mpaP7zJ6zBmL6IKM4ZhfA.38DTA8I6K',1,1,'MANAGER',1,'manager',2),
('cmartinez@mail.com','$2a$10$S4AxUgxT/6x0OZndi.Pc7O3/ciLLcT/qEr2z/nbH.yUOet4IL9ZBy',1,1,'EMPLOYEE',1,'employee',3);
