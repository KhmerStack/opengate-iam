package io.opengate.starter.autoconfigure;

import io.opengate.starter.properties.OpenGateProperties;
import io.opengate.starter.security.OpenGateSecurityConfig;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Auto-configuration for OpenGate IAM integration.
 *
 * Activates when opengate.server-url is set in application properties.
 * Mirrors how KeycloakAutoConfiguration works.
 */
@AutoConfiguration
@ConditionalOnProperty(prefix = "opengate", name = "server-url")
@EnableConfigurationProperties(OpenGateProperties.class)
public class OpenGateAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public OpenGateSecurityConfig openGateSecurityConfig(OpenGateProperties properties) {
        return new OpenGateSecurityConfig(properties);
    }

    @Bean
    @ConditionalOnMissingBean
    public SecurityFilterChain openGateFilterChain(HttpSecurity http,
                                                    OpenGateSecurityConfig config) throws Exception {
        return config.securityFilterChain(http);
    }

    @Bean
    @ConditionalOnMissingBean
    public JwtDecoder openGateJwtDecoder(OpenGateSecurityConfig config) {
        return config.jwtDecoder();
    }
}
