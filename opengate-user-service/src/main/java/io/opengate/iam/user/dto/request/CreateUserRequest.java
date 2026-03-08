package io.opengate.iam.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserRequest(
    @NotBlank String username,
    @NotBlank @Email String email,
    String firstName,
    String lastName,
    String password,
    Boolean enabled
) {}
