package com.scaffold.template.dtos;

import java.util.Map;

public record EmailRequest(
        String templateName,
        String recipientEmail,
        Map<String, Object> variables
) {}
