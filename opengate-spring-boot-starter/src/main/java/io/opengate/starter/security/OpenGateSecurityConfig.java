package io.opengate.starter.security;

import io.opengate.starter.converter.OpenGateJwtConverter;
import io.opengate.starter.properties.OpenGateProperties;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Core security configuration for OpenGate-protected Spring Boot apps.
 *
 * Equivalent to Keycloak's KeycloakWebSecurityConfigurerAdapter but for OpenGate.
 * Apps can override this by defining their own SecurityFilterChain bean.
 */
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class OpenGateSecurityConfig {

    private final OpenGateProperties properties;

    public OpenGateSecurityConfig(OpenGateProperties properties) {
        this.properties = properties;
    }

    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        OpenGateJwtConverter jwtConverter = new OpenGateJwtConverter(properties);

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> {
                // public paths — no token needed
                for (String path : properties.getPublicPaths()) {
                    auth.requestMatchers(path).permitAll();
                }
                // everything else requires a valid token
                auth.anyRequest().authenticated();
            })
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter))
            );

        return http.build();
    }

    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            .withJwkSetUri(properties.getJwksUri())
            .build();
    }
}
