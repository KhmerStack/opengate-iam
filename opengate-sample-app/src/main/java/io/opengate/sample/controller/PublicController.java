package io.opengate.sample.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public endpoints — no token required.
 * curl http://localhost:8090/api/public/status
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
            "service", "OpenGate Sample App",
            "status", "UP",
            "secured", false,
            "message", "This endpoint is public — no token needed"
        );
    }

    @GetMapping("/info")
    public Map<String, String> info() {
        return Map.of(
            "name", "opengate-sample-app",
            "version", "1.0.0",
            "iam", "OpenGate IAM",
            "docs", "http://localhost:3001"
        );
    }
}
