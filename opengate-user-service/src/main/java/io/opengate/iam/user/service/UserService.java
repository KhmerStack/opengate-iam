package io.opengate.iam.user.service;

import io.opengate.iam.common.dto.PageResponse;
import io.opengate.iam.common.event.DomainEvent;
import io.opengate.iam.common.exception.OpenGateException;
import io.opengate.iam.common.exception.ResourceNotFoundException;
import io.opengate.iam.user.domain.entity.User;
import io.opengate.iam.user.domain.entity.UserCredential;
import io.opengate.iam.user.dto.request.CreateUserRequest;
import io.opengate.iam.user.dto.response.UserResponse;
import io.opengate.iam.user.repository.UserCredentialRepository;
import io.opengate.iam.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Transactional
    public UserResponse create(String realm, CreateUserRequest request) {
        if (userRepository.existsByRealmNameAndUsername(realm, request.username())) {
            throw new OpenGateException("USER_EXISTS", "Username already exists in realm");
        }
        if (userRepository.existsByRealmNameAndEmail(realm, request.email())) {
            throw new OpenGateException("EMAIL_EXISTS", "Email already exists in realm");
        }

        User user = User.builder()
            .realmName(realm)
            .username(request.username())
            .email(request.email())
            .firstName(request.firstName())
            .lastName(request.lastName())
            .enabled(request.enabled() != null ? request.enabled() : true)
            .build();
        user = userRepository.save(user);

        if (request.password() != null) {
            UserCredential cred = UserCredential.builder()
                .userId(user.getId())
                .credentialType("PASSWORD")
                .secretHash(passwordEncoder.encode(request.password()))
                .build();
            credentialRepository.save(cred);
        }

        kafkaTemplate.send("user.created",
            DomainEvent.of("user.created", user.getId().toString(), realm, toResponse(user)));
        return toResponse(user);
    }

    public UserResponse getById(UUID id) {
        return toResponse(userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id.toString())));
    }

    public PageResponse<UserResponse> list(String realm, String search, int page, int size) {
        Page<User> users = (search != null && !search.isBlank())
            ? userRepository.searchByRealm(realm, search, PageRequest.of(page, size))
            : userRepository.findByRealmName(realm, PageRequest.of(page, size));
        return new PageResponse<>(
            users.getContent().stream().map(this::toResponse).toList(),
            page, size, users.getTotalElements(), users.getTotalPages()
        );
    }

    @Transactional
    public UserResponse update(UUID id, CreateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));
        if (request.email() != null) user.setEmail(request.email());
        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        if (request.enabled() != null) user.setEnabled(request.enabled());
        kafkaTemplate.send("user.updated",
            DomainEvent.of("user.updated", id.toString(), user.getRealmName(), toResponse(user)));
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));
        userRepository.delete(user);
        kafkaTemplate.send("user.deleted",
            DomainEvent.of("user.deleted", id.toString(), user.getRealmName(), null));
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getRealmName(), u.getUsername(), u.getEmail(),
            u.getFirstName(), u.getLastName(), u.isEnabled(), u.isEmailVerified(),
            u.getCreatedAt(), u.getUpdatedAt());
    }
}
