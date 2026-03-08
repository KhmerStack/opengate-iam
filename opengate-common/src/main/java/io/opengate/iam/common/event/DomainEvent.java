package io.opengate.iam.common.event;

import java.time.Instant;
import java.util.UUID;

public record DomainEvent(
    String eventId,
    String eventType,
    String aggregateId,
    String realm,
    Object payload,
    Instant occurredAt
) {
    public static DomainEvent of(String eventType, String aggregateId, String realm, Object payload) {
        return new DomainEvent(
            UUID.randomUUID().toString(),
            eventType,
            aggregateId,
            realm,
            payload,
            Instant.now()
        );
    }
}
