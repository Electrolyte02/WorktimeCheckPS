# WorktimeCheck - Gestión de Empleados

Este proyecto es una aplicación completa de gestión de empleados que permite administrar datos de empleados, áreas, horarios, ingresos/egresos y justificaciones, junto con funcionalidades de autenticación y reportes.

Está desarrollado como parte de la asignatura **Práctica Supervisada (Año 2025)**.

---

## Tecnologías Utilizadas

### **Frontend**

* Angular 18
* RxJS
* HTML / SCSS
* ngx-charts (para reportes)

### **Backend**

* Java 17
* Spring Boot
* Spring Security (JWT)
* JPA / Hibernate
* MySQL

---

## Funcionalidades Principales

### **Gestión de Empleados**

* Alta, baja y modificación de empleados
* Paginación y filtrado
* Modales para confirmaciones
* Asignación de días y horarios

### **Autenticación y Autorización**

* Registro e inicio de sesión con JWT
* Roles de **empleado, gerente y administrador**
* Permisos basados en rol para acceder a módulos

### **Justificaciones de Tiempo**

* Solicitud de justificación por llegadas tarde o retiros tempranos
* Subida de archivo adjunto
* Aprobación o rechazo por parte de un gerente

### **Reportes (Dashboard)**

* % de puntualidad mensual
* Cantidad de justificaciones por estado
* Filtros por área y rango de fechas

### **Administración del Sistema**

* ABM de Usuarios
* ABM de Áreas
* ABM de Turnos


## Licencia

Proyecto académico desarrollado como parte de la asignatura **Práctica Supervisada - Año 2025**.

---

## Autor

**Esteban Paredes**