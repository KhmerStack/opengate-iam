package io.opengate.iam.client.controller;

import io.opengate.iam.client.dto.request.CreateClientRequest;
import io.opengate.iam.client.dto.response.ClientResponse;
import io.opengate.iam.client.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/realms/{realm}/clients")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> create(@PathVariable String realm, @RequestBody @Valid CreateClientRequest request) {
        String[] result = clientService.create(realm, request);
        return result[1] != null
            ? Map.of("clientId", result[0], "clientSecret", result[1])
            : Map.of("clientId", result[0]);
    }

    @GetMapping("/realms/{realm}/clients")
    public List<ClientResponse> list(@PathVariable String realm) {
        return clientService.list(realm);
    }

    @GetMapping("/realms/{realm}/clients/{id}")
    public ClientResponse get(@PathVariable String realm, @PathVariable UUID id) {
        return clientService.get(id);
    }

    @PostMapping("/realms/{realm}/clients/{id}/secret/regenerate")
    public Map<String, String> regenerateSecret(@PathVariable String realm, @PathVariable UUID id) {
        return Map.of("clientSecret", clientService.regenerateSecret(id));
    }
}
