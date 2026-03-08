package io.opengate.iam.user.repository;

import io.opengate.iam.user.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByRealmNameAndUsername(String realmName, String username);
    Optional<User> findByRealmNameAndEmail(String realmName, String email);
    boolean existsByRealmNameAndUsername(String realmName, String username);
    boolean existsByRealmNameAndEmail(String realmName, String email);

    @Query("SELECT u FROM User u WHERE u.realmName = :realm AND " +
           "(LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchByRealm(String realm, String search, Pageable pageable);

    Page<User> findByRealmName(String realmName, Pageable pageable);
    long countByRealmName(String realmName);
}
