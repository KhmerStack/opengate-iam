package io.opengate.iam.notification.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String type;
    private String recipient;
    private String subject;
    private String template;
    private String status;

    private Instant sentAt;

    @PrePersist
    protected void onCreate() { sentAt = Instant.now(); }
}
