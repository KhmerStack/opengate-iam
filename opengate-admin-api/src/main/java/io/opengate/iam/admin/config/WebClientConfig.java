package io.opengate.iam.admin.config;

import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class WebClientConfig {

    // Use JVM DNS resolver so Docker service names resolve correctly
    private static final HttpClient HTTP_CLIENT =
        HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

    private static final ReactorClientHttpConnector CONNECTOR =
        new ReactorClientHttpConnector(HTTP_CLIENT);

    @Value("${opengate.services.realm-service:http://localhost:9083}")
    private String realmServiceUrl;

    @Value("${opengate.services.user-service:http://localhost:9082}")
    private String userServiceUrl;

    @Value("${opengate.services.rbac-service:http://localhost:9084}")
    private String rbacServiceUrl;

    @Value("${opengate.services.client-service:http://localhost:9085}")
    private String clientServiceUrl;

    @Value("${opengate.services.session-service:http://localhost:9087}")
    private String sessionServiceUrl;

    @Bean("realmWebClient")
    public WebClient realmWebClient() {
        return WebClient.builder().baseUrl(realmServiceUrl).clientConnector(CONNECTOR).build();
    }

    @Bean("userWebClient")
    public WebClient userWebClient() {
        return WebClient.builder().baseUrl(userServiceUrl).clientConnector(CONNECTOR).build();
    }

    @Bean("rbacWebClient")
    public WebClient rbacWebClient() {
        return WebClient.builder().baseUrl(rbacServiceUrl).clientConnector(CONNECTOR).build();
    }

    @Bean("clientWebClient")
    public WebClient clientWebClient() {
        return WebClient.builder().baseUrl(clientServiceUrl).clientConnector(CONNECTOR).build();
    }

    @Bean("sessionWebClient")
    public WebClient sessionWebClient() {
        return WebClient.builder().baseUrl(sessionServiceUrl).clientConnector(CONNECTOR).build();
    }
}
