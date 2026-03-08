package io.opengate.iam.client.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "oauth_clients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OAuthClient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String realmName;

    @Column(unique = true, nullable = false)
    private String clientId;

    private String clientSecretHash;
    private String name;
    private String description;

    @Builder.Default
    private boolean publicClient = false;

    @Builder.Default
    private boolean pkceRequired = false;

    @Builder.Default
    private boolean enabled = true;

    @Column(columnDefinition = "text[]")
    private String[] redirectUris;

    @Column(columnDefinition = "text[]")
    private String[] webOrigins;

    @Column(columnDefinition = "text[]")
    private String[] grantTypes;

    @Column(columnDefinition = "text[]")
    private String[] scopes;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = Instant.now(); updatedAt = Instant.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = Instant.now(); }
}
