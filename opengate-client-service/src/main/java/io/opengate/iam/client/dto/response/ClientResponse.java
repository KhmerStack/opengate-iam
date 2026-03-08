package io.opengate.iam.client.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ClientResponse(
    UUID id,
    String realmName,
    String clientId,
    String name,
    String description,
    boolean publicClient,
    boolean pkceRequired,
    boolean enabled,
    String[] redirectUris,
    String[] grantTypes,
    String[] scopes,
    Instant createdAt
) {}
