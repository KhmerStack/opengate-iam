package io.opengate.iam.notification.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    @KafkaListener(topics = "user.created", groupId = "notification-service")
    public void onUserCreated(Map<String, Object> event) {
        log.info("user.created event: {}", event);
    }

    @KafkaListener(topics = "auth.login.failure", groupId = "notification-service")
    public void onLoginFailure(Map<String, Object> event) {
        log.warn("auth.login.failure event: {}", event);
    }
}
