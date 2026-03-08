package io.opengate.iam.client.service;

import io.opengate.iam.client.domain.entity.OAuthClient;
import io.opengate.iam.client.dto.request.CreateClientRequest;
import io.opengate.iam.client.dto.response.ClientResponse;
import io.opengate.iam.client.repository.OAuthClientRepository;
import io.opengate.iam.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final OAuthClientRepository clientRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String[] create(String realm, CreateClientRequest request) {
        String clientId = "client-" + UUID.randomUUID().toString().substring(0, 8);
        String plainSecret = generateSecret();

        OAuthClient client = OAuthClient.builder()
            .realmName(realm)
            .clientId(clientId)
            .clientSecretHash(request.publicClient() ? null : passwordEncoder.encode(plainSecret))
            .name(request.name())
            .description(request.description())
            .publicClient(request.publicClient())
            .pkceRequired(request.pkceRequired())
            .redirectUris(request.redirectUris() != null ? request.redirectUris().toArray(new String[0]) : new String[0])
            .webOrigins(request.webOrigins() != null ? request.webOrigins().toArray(new String[0]) : new String[0])
            .grantTypes(request.grantTypes() != null ? request.grantTypes().toArray(new String[0]) : new String[]{"authorization_code"})
            .scopes(request.scopes() != null ? request.scopes().toArray(new String[0]) : new String[]{"openid", "profile"})
            .build();

        clientRepository.save(client);
        return new String[]{clientId, request.publicClient() ? null : plainSecret};
    }

    public List<ClientResponse> list(String realm) {
        return clientRepository.findByRealmName(realm).stream().map(this::toResponse).toList();
    }

    public ClientResponse get(UUID id) {
        return toResponse(clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Client", id.toString())));
    }

    @Transactional
    public String regenerateSecret(UUID id) {
        OAuthClient client = clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Client", id.toString()));
        String newSecret = generateSecret();
        client.setClientSecretHash(passwordEncoder.encode(newSecret));
        clientRepository.save(client);
        return newSecret;
    }

    private String generateSecret() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private ClientResponse toResponse(OAuthClient c) {
        return new ClientResponse(c.getId(), c.getRealmName(), c.getClientId(), c.getName(),
            c.getDescription(), c.isPublicClient(), c.isPkceRequired(), c.isEnabled(),
            c.getRedirectUris(), c.getGrantTypes(), c.getScopes(), c.getCreatedAt());
    }
}
