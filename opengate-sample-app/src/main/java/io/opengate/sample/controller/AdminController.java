package io.opengate.sample.controller;

import io.opengate.starter.security.OpenGateUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Admin-only endpoints — requires ROLE_ADMIN.
 *
 * curl -H "Authorization: Bearer <admin-token>" http://localhost:8090/api/admin/dashboard
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@AuthenticationPrincipal Jwt jwt) {
        OpenGateUser user = OpenGateUser.from(jwt);
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("message",    "Welcome to the admin dashboard");
        resp.put("adminUser",  user.getEmail() != null ? user.getEmail() : user.getUsername());
        resp.put("realm",      user.getRealm() != null ? user.getRealm() : "master");
        resp.put("serverTime", Instant.now().toString());
        resp.put("stats",      Map.of("activeUsers", 1284, "requests", 52840, "uptime", "99.98%"));
        return resp;
    }

    @GetMapping("/audit")
    public Map<String, Object> audit(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
            "requestedBy", OpenGateUser.from(jwt).getEmail(),
            "events", List.of(
                Map.of("type", "LOGIN_SUCCESS",  "user", "alice@example.com", "time", "2 min ago"),
                Map.of("type", "LOGIN_FAILURE",  "user", "unknown@attacker.io", "time", "5 min ago"),
                Map.of("type", "USER_CREATED",   "user", "bob@corp.com",       "time", "12 min ago"),
                Map.of("type", "PASSWORD_RESET", "user", "carol@example.com",  "time", "1 hr ago")
            )
        );
    }
}
