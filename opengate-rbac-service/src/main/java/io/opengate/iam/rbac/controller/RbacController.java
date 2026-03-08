package io.opengate.iam.rbac.controller;

import io.opengate.iam.rbac.dto.request.CreateRoleRequest;
import io.opengate.iam.rbac.dto.response.RoleResponse;
import io.opengate.iam.rbac.service.RbacService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class RbacController {

    private final RbacService rbacService;

    @GetMapping("/realms/{realm}/roles")
    public List<RoleResponse> listRoles(@PathVariable String realm) {
        return rbacService.listRoles(realm);
    }

    @PostMapping("/realms/{realm}/roles")
    @ResponseStatus(HttpStatus.CREATED)
    public RoleResponse createRole(@PathVariable String realm, @RequestBody @Valid CreateRoleRequest request) {
        return rbacService.createRole(realm, request);
    }

    @PostMapping("/realms/{realm}/users/{userId}/role-mappings")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignRole(@PathVariable String realm, @PathVariable UUID userId, @RequestParam UUID roleId) {
        rbacService.assignRoleToUser(realm, userId, roleId);
    }

    @GetMapping("/realms/{realm}/users/{userId}/role-mappings")
    public List<UUID> getUserRoles(@PathVariable String realm, @PathVariable UUID userId) {
        return rbacService.getUserRoles(realm, userId);
    }

    @PostMapping("/evaluate")
    public Map<String, String> evaluate(@RequestBody Map<String, String> request) {
        String decision = rbacService.evaluate(
            request.get("userId"), request.get("realmName"),
            request.get("resource"), request.get("action"));
        return Map.of("decision", decision);
    }
}
