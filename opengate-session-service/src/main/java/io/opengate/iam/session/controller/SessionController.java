package io.opengate.iam.session.controller;

import io.opengate.iam.session.model.Session;
import io.opengate.iam.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public Session createSession(
        @RequestParam String userId,
        @RequestParam String realmId,
        @RequestParam String clientId,
        @RequestHeader(value = "X-Forwarded-For", defaultValue = "unknown") String ip,
        @RequestHeader(value = "User-Agent", defaultValue = "unknown") String ua
    ) {
        return sessionService.create(userId, realmId, clientId, ip, ua);
    }

    @GetMapping("/sessions/{sessionId}")
    public Session getSession(@PathVariable String sessionId) {
        return sessionService.get(sessionId);
    }

    @DeleteMapping("/sessions/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void terminateSession(@PathVariable String sessionId) {
        sessionService.terminate(sessionId);
    }

    @GetMapping("/users/{userId}/sessions")
    public List<Session> getUserSessions(@PathVariable String userId) {
        return sessionService.getUserSessions(userId);
    }

    @DeleteMapping("/users/{userId}/sessions")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void terminateAllUserSessions(@PathVariable String userId) {
        sessionService.terminateAllUserSessions(userId);
    }
}
