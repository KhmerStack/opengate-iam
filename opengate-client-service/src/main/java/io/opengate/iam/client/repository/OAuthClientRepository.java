package io.opengate.iam.client.repository;

import io.opengate.iam.client.domain.entity.OAuthClient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OAuthClientRepository extends JpaRepository<OAuthClient, UUID> {
    List<OAuthClient> findByRealmName(String realmName);
    Optional<OAuthClient> findByClientId(String clientId);
    boolean existsByClientId(String clientId);
}
