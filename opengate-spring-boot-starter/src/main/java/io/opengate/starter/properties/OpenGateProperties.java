package io.opengate.starter.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * OpenGate IAM configuration properties.
 *
 * Usage in application.yml:
 *
 *   opengate:
 *     server-url: http://localhost:9080
 *     realm: master
 *     resource: my-app          # clientId (for role extraction)
 *     public-client: true
 */
@ConfigurationProperties(prefix = "opengate")
public class OpenGateProperties {

    /** Base URL of the OpenGate IAM gateway (e.g. http://localhost:9080) */
    private String serverUrl = "http://localhost:9080";

    /** Realm name (e.g. master, corp) */
    private String realm = "master";

    /** OAuth2 client ID of this application */
    private String resource = "my-app";

    /** If true, no client secret required (PKCE public client) */
    private boolean publicClient = true;

    /** Comma-separated list of roles that have admin access */
    private String adminRoles = "admin,realm-admin";

    /** Path prefix for secured endpoints (default: /api/**) */
    private String securedPath = "/api/**";

    /** Paths that are publicly accessible (no token required) */
    private String[] publicPaths = {
        "/api/public/**",
        "/actuator/health",
        "/actuator/info",
        "/v3/api-docs/**",
        "/swagger-ui/**"
    };

    // --- derived helpers ---

    public String getIssuerUri() {
        return serverUrl + "/realms/" + realm;
    }

    public String getJwksUri() {
        return serverUrl.replace(":9080", ":9081")
               + "/oauth2/jwks";
    }

    public String getTokenEndpoint() {
        return serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
    }

    // getters & setters
    public String getServerUrl() { return serverUrl; }
    public void setServerUrl(String serverUrl) { this.serverUrl = serverUrl; }
    public String getRealm() { return realm; }
    public void setRealm(String realm) { this.realm = realm; }
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    public boolean isPublicClient() { return publicClient; }
    public void setPublicClient(boolean publicClient) { this.publicClient = publicClient; }
    public String getAdminRoles() { return adminRoles; }
    public void setAdminRoles(String adminRoles) { this.adminRoles = adminRoles; }
    public String getSecuredPath() { return securedPath; }
    public void setSecuredPath(String securedPath) { this.securedPath = securedPath; }
    public String[] getPublicPaths() { return publicPaths; }
    public void setPublicPaths(String[] publicPaths) { this.publicPaths = publicPaths; }
}
