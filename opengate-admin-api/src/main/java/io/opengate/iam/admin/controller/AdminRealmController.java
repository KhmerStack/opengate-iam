package io.opengate.iam.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin/realms")
@RequiredArgsConstructor
public class AdminRealmController {

    @Qualifier("realmWebClient")
    private final WebClient realmWebClient;

    @GetMapping
    public Mono<Object> listRealms() {
        return realmWebClient.get().uri("/realms").retrieve().bodyToMono(Object.class);
    }

    @GetMapping("/{realm}")
    public Mono<Object> getRealm(@PathVariable String realm) {
        return realmWebClient.get().uri("/realms/{realm}", realm).retrieve().bodyToMono(Object.class);
    }

    @PostMapping
    public Mono<Object> createRealm(@RequestBody Object request) {
        return realmWebClient.post().uri("/realms").bodyValue(request).retrieve().bodyToMono(Object.class);
    }

    @PutMapping("/{realm}")
    public Mono<Object> updateRealm(@PathVariable String realm, @RequestBody Object request) {
        return realmWebClient.put().uri("/realms/{realm}", realm).bodyValue(request).retrieve().bodyToMono(Object.class);
    }

    @DeleteMapping("/{realm}")
    public Mono<Void> deleteRealm(@PathVariable String realm) {
        return realmWebClient.delete().uri("/realms/{realm}", realm).retrieve().bodyToMono(Void.class);
    }
}
