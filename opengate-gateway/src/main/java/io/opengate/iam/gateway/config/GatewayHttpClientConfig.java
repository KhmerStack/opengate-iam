package io.opengate.iam.gateway.config;

import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.cloud.gateway.config.HttpClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Force Spring Cloud Gateway's Netty HTTP client to use the JVM DNS resolver
 * (i.e. /etc/resolv.conf → Docker's 127.0.0.11) instead of Netty's own async
 * DNS resolver, which cannot resolve Docker container hostnames.
 */
@Configuration
public class GatewayHttpClientConfig {

    @Bean
    public HttpClientCustomizer jvmDnsResolverCustomizer() {
        return httpClient -> httpClient.resolver(DefaultAddressResolverGroup.INSTANCE);
    }
}
