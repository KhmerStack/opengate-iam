package io.opengate.iam.client.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateClientRequest(
    @NotBlank String name,
    String description,
    boolean publicClient,
    boolean pkceRequired,
    List<String> redirectUris,
    List<String> webOrigins,
    List<String> grantTypes,
    List<String> scopes
) {}
