package io.opengate.iam.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/realms/{realm}/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    @GetMapping
    public Mono<Map<String, Object>> getStats(@PathVariable String realm) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("realm", realm);
        stats.put("totalUsers", 1284);
        stats.put("activeSessions", 342);
        stats.put("registeredClients", 48);
        stats.put("totalRealms", 5);
        return Mono.just(stats);
    }
}
