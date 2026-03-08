package io.opengate.iam.rbac.dto.response;

import java.time.Instant;
import java.util.UUID;

public record RoleResponse(UUID id, String realmName, String name, String description, boolean composite, Instant createdAt) {}
