package io.opengate.starter.converter;

import io.opengate.starter.properties.OpenGateProperties;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Converts OpenGate JWT tokens into Spring Security Authentication objects.
 *
 * OpenGate JWT payload example:
 * {
 *   "sub": "usr_abc123",
 *   "email": "alice@example.com",
 *   "realm": "master",
 *   "roles": ["admin", "user"],
 *   "realm_access": { "roles": ["admin", "user"] },
 *   "resource_access": {
 *     "my-app": { "roles": ["app-admin"] }
 *   }
 * }
 *
 * This maps to Spring Security roles:
 *   ROLE_ADMIN, ROLE_USER, ROLE_APP-ADMIN
 */
public class OpenGateJwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final OpenGateProperties properties;

    public OpenGateJwtConverter(OpenGateProperties properties) {
        this.properties = properties;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        String principalName = extractPrincipal(jwt);
        return new JwtAuthenticationToken(jwt, authorities, principalName);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        // 1. Flat "roles" claim (OpenGate native format)
        List<String> flatRoles = jwt.getClaimAsStringList("roles");
        if (flatRoles != null) roles.addAll(flatRoles);

        // 2. realm_access.roles (Keycloak-compatible format)
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess != null) {
            Object realmRoles = realmAccess.get("roles");
            if (realmRoles instanceof List<?> list) {
                list.stream().map(Object::toString).forEach(roles::add);
            }
        }

        // 3. resource_access.<clientId>.roles (per-app roles)
        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
        if (resourceAccess != null) {
            Object clientAccess = resourceAccess.get(properties.getResource());
            if (clientAccess instanceof Map<?, ?> clientMap) {
                Object clientRoles = clientMap.get("roles");
                if (clientRoles instanceof List<?> list) {
                    list.stream().map(Object::toString).forEach(roles::add);
                }
            }
        }

        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            .collect(Collectors.toSet());
    }

    private String extractPrincipal(Jwt jwt) {
        // Prefer email > preferred_username > sub
        return Stream.of("email", "preferred_username", "sub")
            .map(jwt::getClaimAsString)
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(jwt.getSubject());
    }
}
