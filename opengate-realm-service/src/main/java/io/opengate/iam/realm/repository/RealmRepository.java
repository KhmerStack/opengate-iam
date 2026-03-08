package io.opengate.iam.realm.repository;

import io.opengate.iam.realm.domain.entity.Realm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RealmRepository extends JpaRepository<Realm, UUID> {
    Optional<Realm> findByName(String name);
    boolean existsByName(String name);
}
