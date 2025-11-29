
CREATE TABLE `email_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `html_content` text,
  `text_content` text,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `areas` (
  `area_id` int NOT NULL AUTO_INCREMENT,
  `area_responsible` bigint DEFAULT NULL,
  `area_state` bigint NOT NULL,
  `area_auduser` bigint NOT NULL,
  `area_description` varchar(255) NOT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `notification_sender` varchar(100) DEFAULT NULL,
  `notification_receiver` varchar(100) DEFAULT NULL,
  `notification_subject` varchar(100) DEFAULT NULL,
  `notification_sentstatus` tinyint(1) DEFAULT NULL,
  `notification_auduser` bigint DEFAULT NULL,
  `notification_senttime` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(255) NOT NULL,
  `employee_surname` varchar(255) NOT NULL,
  `employee_document` varchar(255) NOT NULL,
  `employee_email` varchar(255) DEFAULT NULL,
  `employee_state` bigint NOT NULL,
  `employee_auduser` bigint NOT NULL,
  `area_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `FK_Employees_Areas` (`area_id`),
  CONSTRAINT `FK_Employees_Areas` FOREIGN KEY (`area_id`) REFERENCES `areas` (`area_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `employee_shifts` (
  `shift_id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `shift_day` varchar(20) DEFAULT NULL,
  `shift_entry` time DEFAULT NULL,
  `shift_exit` time DEFAULT NULL,
  `shift_duration` bigint DEFAULT NULL,
  `shift_state` bigint NOT NULL,
  `shift_auduser` bigint NOT NULL,
  PRIMARY KEY (`shift_id`),
  KEY `FK_Shifts_Employee` (`employee_id`),
  CONSTRAINT `FK_Shifts_Employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee_times` (
  `time_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `time_day` datetime DEFAULT NULL,
  `time_type` char(1) DEFAULT NULL,
  `time_ontime` tinyint(1) DEFAULT NULL,
  `time_state` bigint NOT NULL,
  `time_auduser` bigint NOT NULL,
  PRIMARY KEY (`time_id`),
  KEY `FK_Times_Employee` (`employee_id`),
  CONSTRAINT `FK_Times_Employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `time_justifications` (
  `justification_id` int NOT NULL AUTO_INCREMENT,
  `time_id` int DEFAULT NULL,
  `justification_observation` varchar(255) DEFAULT NULL,
  `justification_url` varchar(255) DEFAULT NULL,
  `justification_state` int DEFAULT NULL,
  `justification_auduser` int DEFAULT NULL,
  `time_auduser` bigint NOT NULL,
  `time_state` bigint NOT NULL,
  PRIMARY KEY (`justification_id`),
  KEY `FK_Justifications_Time` (`time_id`),
  CONSTRAINT `FK_Justifications_Time` FOREIGN KEY (`time_id`) REFERENCES `employee_times` (`time_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `justification_checks` (
  `check_id` bigint NOT NULL AUTO_INCREMENT,
  `justification_id` int DEFAULT NULL,
  `check_approval` tinyint(1) DEFAULT NULL,
  `check_reason` varchar(255) DEFAULT NULL,
  `check_state` bigint NOT NULL,
  `check_auduser` bigint NOT NULL,
  PRIMARY KEY (`check_id`),
  KEY `FK_Checks_Justification` (`justification_id`),
  CONSTRAINT `FK_Checks_Justification` FOREIGN KEY (`justification_id`) REFERENCES `time_justifications` (`justification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_state` bigint DEFAULT NULL,
  `user_auduser` int DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL,
  `user_aud_user` bigint DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_employee` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_employee` (`user_employee`),
  CONSTRAINT `fk_user_employee` FOREIGN KEY (`user_employee`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
