package io.opengate.iam.rbac.repository;

import io.opengate.iam.rbac.domain.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    List<Role> findByRealmName(String realmName);
    boolean existsByRealmNameAndName(String realmName, String name);
}
