package io.opengate.iam.user.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String realmName,
    String username,
    String email,
    String firstName,
    String lastName,
    boolean enabled,
    boolean emailVerified,
    Instant createdAt,
    Instant updatedAt
) {}
