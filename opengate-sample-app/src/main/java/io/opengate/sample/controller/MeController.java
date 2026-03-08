package io.opengate.sample.controller;

import io.opengate.starter.security.OpenGateUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Returns info about the currently authenticated user from the OpenGate JWT.
 *
 * curl -H "Authorization: Bearer <token>" http://localhost:8090/api/me
 */
@RestController
@RequestMapping("/api/me")
public class MeController {

    @GetMapping
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        OpenGateUser user = OpenGateUser.from(jwt);
        return Map.of(
            "userId",   user.getUserId(),
            "email",    user.getEmail() != null ? user.getEmail() : "",
            "username", user.getUsername() != null ? user.getUsername() : "",
            "realm",    user.getRealm() != null ? user.getRealm() : "master",
            "roles",    user.getRoles(),
            "isAdmin",  user.hasRole("admin")
        );
    }
}
