package io.opengate.iam.rbac.service;

import io.opengate.iam.common.exception.OpenGateException;
import io.opengate.iam.common.exception.ResourceNotFoundException;
import io.opengate.iam.rbac.domain.entity.Role;
import io.opengate.iam.rbac.domain.entity.UserRoleMapping;
import io.opengate.iam.rbac.dto.request.CreateRoleRequest;
import io.opengate.iam.rbac.dto.response.RoleResponse;
import io.opengate.iam.rbac.repository.RoleRepository;
import io.opengate.iam.rbac.repository.UserRoleMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RbacService {

    private final RoleRepository roleRepository;
    private final UserRoleMappingRepository userRoleMappingRepository;

    @Transactional
    public RoleResponse createRole(String realm, CreateRoleRequest request) {
        if (roleRepository.existsByRealmNameAndName(realm, request.name())) {
            throw new OpenGateException("ROLE_EXISTS", "Role already exists: " + request.name());
        }
        Role role = Role.builder()
            .realmName(realm)
            .name(request.name())
            .description(request.description())
            .composite(request.composite() != null && request.composite())
            .build();
        return toResponse(roleRepository.save(role));
    }

    public List<RoleResponse> listRoles(String realm) {
        return roleRepository.findByRealmName(realm).stream().map(this::toResponse).toList();
    }

    @Transactional
    public void assignRoleToUser(String realm, UUID userId, UUID roleId) {
        roleRepository.findById(roleId)
            .orElseThrow(() -> new ResourceNotFoundException("Role", roleId.toString()));
        UserRoleMapping mapping = UserRoleMapping.builder()
            .userId(userId).roleId(roleId).realmName(realm).build();
        userRoleMappingRepository.save(mapping);
    }

    public List<UUID> getUserRoles(String realm, UUID userId) {
        return userRoleMappingRepository.findByUserIdAndRealmName(userId, realm)
            .stream().map(UserRoleMapping::getRoleId).toList();
    }

    public String evaluate(String userId, String realm, String resource, String action) {
        List<UserRoleMapping> mappings = userRoleMappingRepository
            .findByUserIdAndRealmName(UUID.fromString(userId), realm);
        return mappings.isEmpty() ? "DENY" : "PERMIT";
    }

    private RoleResponse toResponse(Role r) {
        return new RoleResponse(r.getId(), r.getRealmName(), r.getName(),
            r.getDescription(), r.isComposite(), r.getCreatedAt());
    }
}
