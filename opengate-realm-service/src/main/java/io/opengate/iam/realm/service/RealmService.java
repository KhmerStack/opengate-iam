package io.opengate.iam.realm.service;

import io.opengate.iam.common.exception.OpenGateException;
import io.opengate.iam.common.exception.ResourceNotFoundException;
import io.opengate.iam.realm.domain.entity.Realm;
import io.opengate.iam.realm.dto.request.CreateRealmRequest;
import io.opengate.iam.realm.dto.response.RealmResponse;
import io.opengate.iam.realm.repository.RealmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RealmService {

    private final RealmRepository realmRepository;

    @Transactional
    public RealmResponse create(CreateRealmRequest request) {
        if (realmRepository.existsByName(request.name())) {
            throw new OpenGateException("REALM_EXISTS", "Realm already exists: " + request.name());
        }
        Realm realm = Realm.builder()
            .name(request.name())
            .displayName(request.displayName())
            .loginTheme(request.loginTheme())
            .tokenLifespanSeconds(request.tokenLifespanSeconds() != null ? request.tokenLifespanSeconds() : 300)
            .refreshTokenLifespanSeconds(request.refreshTokenLifespanSeconds() != null ? request.refreshTokenLifespanSeconds() : 2592000)
            .mfaRequired(request.mfaRequired() != null && request.mfaRequired())
            .build();
        return toResponse(realmRepository.save(realm));
    }

    public RealmResponse getByName(String name) {
        return toResponse(realmRepository.findByName(name)
            .orElseThrow(() -> new ResourceNotFoundException("Realm", name)));
    }

    public List<RealmResponse> listAll() {
        return realmRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public RealmResponse update(String name, CreateRealmRequest request) {
        Realm realm = realmRepository.findByName(name)
            .orElseThrow(() -> new ResourceNotFoundException("Realm", name));
        if (request.displayName() != null) realm.setDisplayName(request.displayName());
        if (request.loginTheme() != null) realm.setLoginTheme(request.loginTheme());
        if (request.tokenLifespanSeconds() != null) realm.setTokenLifespanSeconds(request.tokenLifespanSeconds());
        if (request.refreshTokenLifespanSeconds() != null) realm.setRefreshTokenLifespanSeconds(request.refreshTokenLifespanSeconds());
        if (request.mfaRequired() != null) realm.setMfaRequired(request.mfaRequired());
        return toResponse(realmRepository.save(realm));
    }

    @Transactional
    public void delete(String name) {
        Realm realm = realmRepository.findByName(name)
            .orElseThrow(() -> new ResourceNotFoundException("Realm", name));
        realmRepository.delete(realm);
    }

    private RealmResponse toResponse(Realm r) {
        return new RealmResponse(r.getId(), r.getName(), r.getDisplayName(), r.getLoginTheme(),
            r.getTokenLifespanSeconds(), r.getRefreshTokenLifespanSeconds(), r.isMfaRequired(),
            r.isEnabled(), r.getCreatedAt(), r.getUpdatedAt());
    }
}
