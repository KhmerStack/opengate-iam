package io.opengate.iam.realm.dto.response;

import java.time.Instant;
import java.util.UUID;

public record RealmResponse(
    UUID id,
    String name,
    String displayName,
    String loginTheme,
    int tokenLifespanSeconds,
    int refreshTokenLifespanSeconds,
    boolean mfaRequired,
    boolean enabled,
    Instant createdAt,
    Instant updatedAt
) {}
