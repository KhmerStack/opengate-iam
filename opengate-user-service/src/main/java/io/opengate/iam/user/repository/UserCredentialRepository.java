package io.opengate.iam.user.repository;

import io.opengate.iam.user.domain.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserCredentialRepository extends JpaRepository<UserCredential, UUID> {
    Optional<UserCredential> findByUserIdAndCredentialType(UUID userId, String type);
}
