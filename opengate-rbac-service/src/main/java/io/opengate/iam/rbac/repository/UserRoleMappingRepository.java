package io.opengate.iam.rbac.repository;

import io.opengate.iam.rbac.domain.entity.UserRoleMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRoleMappingRepository extends JpaRepository<UserRoleMapping, UUID> {
    List<UserRoleMapping> findByUserIdAndRealmName(UUID userId, String realmName);
}
