package io.opengate.iam.realm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateRealmRequest(
    @NotBlank @Pattern(regexp = "^[a-z0-9-]+$") String name,
    String displayName,
    String loginTheme,
    Integer tokenLifespanSeconds,
    Integer refreshTokenLifespanSeconds,
    Boolean mfaRequired
) {}
