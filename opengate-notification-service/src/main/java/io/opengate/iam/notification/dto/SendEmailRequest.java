package io.opengate.iam.notification.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record SendEmailRequest(
    @NotBlank @Email String to,
    @NotBlank String subject,
    @NotBlank String template,
    Map<String, Object> variables
) {}
