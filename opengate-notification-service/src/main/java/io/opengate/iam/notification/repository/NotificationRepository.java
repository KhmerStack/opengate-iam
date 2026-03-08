package io.opengate.iam.notification.repository;

import io.opengate.iam.notification.domain.entity.NotificationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<NotificationRecord, UUID> {}
