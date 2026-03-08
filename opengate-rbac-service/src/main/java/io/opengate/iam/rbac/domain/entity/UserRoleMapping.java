package io.opengate.iam.rbac.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_role_mappings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserRoleMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID roleId;

    @Column(nullable = false)
    private String realmName;
}
