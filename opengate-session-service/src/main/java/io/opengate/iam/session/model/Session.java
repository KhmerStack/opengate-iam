package io.opengate.iam.session.model;

import lombok.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session implements Serializable {
    private String sessionId;
    private String userId;
    private String realmId;
    private List<String> clientIds;
    private String ipAddress;
    private String userAgent;
    private Instant createdAt;
    private Instant lastAccessedAt;
    private Instant expiresAt;
}
