package io.opengate.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Demo Spring Boot app protected by OpenGate IAM.
 *
 * Equivalent of a Keycloak-protected app — just point opengate.server-url
 * at your OpenGate instance and it works automatically.
 *
 * Run on port 8090:
 *   ./gradlew :opengate-sample-app:bootRun
 *
 * Test:
 *   # 1. Get a token from OpenGate
 *   TOKEN=$(curl -s -X POST http://localhost:9080/realms/master/protocol/openid-connect/token \
 *     -d "grant_type=client_credentials&client_id=sample-app&client_secret=<secret>" \
 *     | jq -r .access_token)
 *
 *   # 2. Call a protected endpoint
 *   curl -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/products
 */
@SpringBootApplication
public class SampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }
}
