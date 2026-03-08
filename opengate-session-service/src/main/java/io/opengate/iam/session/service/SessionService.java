package io.opengate.iam.session.service;

import io.opengate.iam.common.event.DomainEvent;
import io.opengate.iam.session.model.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final Duration SESSION_TTL = Duration.ofHours(8);
    private static final String SESSION_KEY = "session:";
    private static final String USER_SESSIONS_KEY = "user_sessions:";

    public Session create(String userId, String realmId, String clientId, String ip, String ua) {
        String sessionId = UUID.randomUUID().toString();
        Session session = Session.builder()
            .sessionId(sessionId)
            .userId(userId)
            .realmId(realmId)
            .clientIds(List.of(clientId))
            .ipAddress(ip)
            .userAgent(ua)
            .createdAt(Instant.now())
            .lastAccessedAt(Instant.now())
            .expiresAt(Instant.now().plus(SESSION_TTL))
            .build();
        redisTemplate.opsForValue().set(SESSION_KEY + sessionId, session, SESSION_TTL);
        redisTemplate.opsForSet().add(USER_SESSIONS_KEY + userId, session);
        return session;
    }

    public Session get(String sessionId) {
        Object obj = redisTemplate.opsForValue().get(SESSION_KEY + sessionId);
        return obj instanceof Session ? (Session) obj : null;
    }

    public void terminate(String sessionId) {
        Session session = get(sessionId);
        if (session != null) {
            redisTemplate.delete(SESSION_KEY + sessionId);
            kafkaTemplate.send("session.terminated",
                DomainEvent.of("session.terminated", sessionId, session.getRealmId(), session));
        }
    }

    public List<Session> getUserSessions(String userId) {
        Set<Object> sessions = redisTemplate.opsForSet().members(USER_SESSIONS_KEY + userId);
        if (sessions == null) return List.of();
        return sessions.stream()
            .filter(o -> o instanceof Session)
            .map(o -> (Session) o)
            .toList();
    }

    public void terminateAllUserSessions(String userId) {
        getUserSessions(userId).forEach(s -> terminate(s.getSessionId()));
    }
}
