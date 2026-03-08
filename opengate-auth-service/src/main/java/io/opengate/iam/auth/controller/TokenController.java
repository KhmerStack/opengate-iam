package io.opengate.iam.auth.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TokenController {

    @GetMapping("/realms/{realm}/.well-known/openid-configuration")
    public Map<String, Object> discovery(@PathVariable String realm) {
        String base = "http://localhost:9080/realms/" + realm;
        Map<String, Object> doc = new HashMap<>();
        doc.put("issuer", base);
        doc.put("authorization_endpoint", base + "/protocol/openid-connect/auth");
        doc.put("token_endpoint", base + "/protocol/openid-connect/token");
        doc.put("userinfo_endpoint", base + "/protocol/openid-connect/userinfo");
        doc.put("jwks_uri", base + "/protocol/openid-connect/certs");
        doc.put("revocation_endpoint", base + "/protocol/openid-connect/revoke");
        doc.put("introspection_endpoint", base + "/protocol/openid-connect/introspect");
        doc.put("end_session_endpoint", base + "/protocol/openid-connect/logout");
        doc.put("response_types_supported", List.of("code"));
        doc.put("grant_types_supported", List.of("authorization_code", "client_credentials", "refresh_token"));
        doc.put("subject_types_supported", List.of("public"));
        doc.put("id_token_signing_alg_values_supported", List.of("RS256"));
        doc.put("code_challenge_methods_supported", List.of("S256"));
        doc.put("scopes_supported", List.of("openid", "profile", "email", "offline_access"));
        return doc;
    }
}
