package io.opengate.starter.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Convenience wrapper around the OpenGate JWT.
 * Inject via @AuthenticationPrincipal in controllers.
 *
 * Example:
 *   @GetMapping("/me")
 *   public OpenGateUser me(@AuthenticationPrincipal Jwt jwt) {
 *       return OpenGateUser.from(jwt);
 *   }
 */
public class OpenGateUser {

    private final String userId;
    private final String email;
    private final String username;
    private final String realm;
    private final List<String> roles;
    private final String accessToken;

    private OpenGateUser(Jwt jwt) {
        this.userId      = jwt.getSubject();
        this.email       = jwt.getClaimAsString("email");
        this.username    = jwt.getClaimAsString("preferred_username") != null
                           ? jwt.getClaimAsString("preferred_username")
                           : jwt.getClaimAsString("email");
        this.realm       = jwt.getClaimAsString("realm");
        this.roles       = jwt.getClaimAsStringList("roles") != null
                           ? jwt.getClaimAsStringList("roles")
                           : List.of();
        this.accessToken = jwt.getTokenValue();
    }

    public static OpenGateUser from(Jwt jwt) {
        return new OpenGateUser(jwt);
    }

    public boolean hasRole(String role) {
        return roles.contains(role) || roles.contains(role.toLowerCase());
    }

    public String getUserId()      { return userId; }
    public String getEmail()       { return email; }
    public String getUsername()    { return username; }
    public String getRealm()       { return realm; }
    public List<String> getRoles() { return roles; }
    public String getAccessToken() { return accessToken; }

    @Override
    public String toString() {
        return "OpenGateUser{userId='%s', email='%s', realm='%s', roles=%s}"
               .formatted(userId, email, realm, roles);
    }
}
