package com.scaffold.template.dtos;

public record EmailResponse(
        boolean success,
        String message,
        String templateUsed
) {}