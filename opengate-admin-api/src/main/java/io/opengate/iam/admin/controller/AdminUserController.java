package io.opengate.iam.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/admin/realms/{realm}/users")
@RequiredArgsConstructor
public class AdminUserController {

    @Qualifier("userWebClient")
    private final WebClient userWebClient;

    @GetMapping
    public Mono<Object> listUsers(
        @PathVariable String realm,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return userWebClient.get()
            .uri(u -> u.path("/users")
                .queryParam("realm", realm)
                .queryParam("search", search)
                .queryParam("page", page)
                .queryParam("size", size).build())
            .retrieve().bodyToMono(Object.class);
    }

    @GetMapping("/{id}")
    public Mono<Object> getUser(@PathVariable String realm, @PathVariable String id) {
        return userWebClient.get().uri("/users/{id}", id).retrieve().bodyToMono(Object.class);
    }

    @PostMapping
    public Mono<Object> createUser(@PathVariable String realm, @RequestBody Object request) {
        return userWebClient.post()
            .uri(u -> u.path("/users").queryParam("realm", realm).build())
            .bodyValue(request).retrieve().bodyToMono(Object.class);
    }

    @PutMapping("/{id}")
    public Mono<Object> updateUser(@PathVariable String realm, @PathVariable String id, @RequestBody Object request) {
        return userWebClient.put().uri("/users/{id}", id).bodyValue(request).retrieve().bodyToMono(Object.class);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteUser(@PathVariable String realm, @PathVariable String id) {
        return userWebClient.delete().uri("/users/{id}", id).retrieve().bodyToMono(Void.class);
    }
}
