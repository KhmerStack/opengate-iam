package io.opengate.iam.rbac.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateRoleRequest(
    @NotBlank String name,
    String description,
    Boolean composite
) {}
