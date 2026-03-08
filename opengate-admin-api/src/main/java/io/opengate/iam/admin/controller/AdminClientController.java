package io.opengate.iam.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin/realms/{realm}/clients")
@RequiredArgsConstructor
public class AdminClientController {

    @Qualifier("clientWebClient")
    private final WebClient clientWebClient;

    @GetMapping
    public Mono<Object> listClients(@PathVariable String realm) {
        return clientWebClient.get().uri("/realms/{realm}/clients", realm).retrieve().bodyToMono(Object.class);
    }

    @PostMapping
    public Mono<Object> createClient(@PathVariable String realm, @RequestBody Object request) {
        return clientWebClient.post().uri("/realms/{realm}/clients", realm).bodyValue(request).retrieve().bodyToMono(Object.class);
    }

    @GetMapping("/{id}")
    public Mono<Object> getClient(@PathVariable String realm, @PathVariable String id) {
        return clientWebClient.get().uri("/realms/{realm}/clients/{id}", realm, id).retrieve().bodyToMono(Object.class);
    }

    @PostMapping("/{id}/secret/regenerate")
    public Mono<Object> regenerateSecret(@PathVariable String realm, @PathVariable String id) {
        return clientWebClient.post().uri("/realms/{realm}/clients/{id}/secret/regenerate", realm, id).retrieve().bodyToMono(Object.class);
    }
}
