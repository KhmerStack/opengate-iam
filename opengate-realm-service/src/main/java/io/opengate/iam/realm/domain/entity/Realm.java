package io.opengate.iam.realm.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "realms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Realm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    private String displayName;
    private String loginTheme;

    @Builder.Default
    private int tokenLifespanSeconds = 300;

    @Builder.Default
    private int refreshTokenLifespanSeconds = 2592000;

    @Builder.Default
    private boolean mfaRequired = false;

    @Column(columnDefinition = "text")
    private String passwordPolicy;

    @Column(columnDefinition = "text")
    private String smtpSettings;

    @Builder.Default
    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = Instant.now(); updatedAt = Instant.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = Instant.now(); }
}
