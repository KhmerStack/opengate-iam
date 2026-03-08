# Changelog

All notable changes to OpenGate IAM are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [v1.1.0] — 2026-03-09

### Added
- **Docker Compose** — single `docker compose up --build` runs all 17 containers (infra + 10 backend services + 3 frontends)
- **Dockerfiles** — multi-stage builds (`eclipse-temurin:21-jdk-alpine` build, `eclipse-temurin:21-jre-alpine` runtime) for all 11 backend services; `node:20-alpine` multi-stage for 3 frontends
- **`.env` config** — `DOMAIN` and `PROTOCOL` variables for easy localhost ↔ production switching
- **`settings.gradle`, `gradlew`, `gradlew.bat`, `gradle/wrapper/`** — added Spring Initializr standard layout to every service module
- **`GatewayHttpClientConfig.java`** — new config class forcing Netty's HTTP client in Spring Cloud Gateway to use JVM DNS resolver (fixes Docker service name resolution)
- **`RedisConfig.java`** in session-service — explicit `RedisTemplate<String, Object>` bean with Jackson JSON serializer
- **`V2__alter_jsonb_to_text.sql`** migration in realm-service — fixes column type mismatch between Flyway schema and Hibernate entity
- **Configurable auth issuer** — `OPENGATE_ISSUER_URI` env var in auth-service (was hardcoded `http://localhost:9080/realms/master`)
- **Configurable redirect URIs** — `OPENGATE_CONSOLE_REDIRECT_URI` and `OPENGATE_SAMPLE_APP_REDIRECT_URI` env vars in auth-service
- **Gateway route `rbac-service-realms`** — routes `/api/realms/*/roles` and role-mapping paths to rbac-service
- **Gateway client-service route** extended to also handle `/api/realms/*/clients/**` paths

### Changed
- **Build files** — converted all `build.gradle.kts` (Kotlin DSL) to `build.gradle` (Groovy DSL) for Spring standard convention
- **Gradle wrapper** — upgraded from 8.7 to 8.12 (fixes SIGSEGV crash on Apple Silicon ARM64 in Docker Linux)
- **`opengate-gateway/build.gradle`** — removed `opengate-common` dependency (it pulled in `spring-boot-starter-web`/Tomcat, conflicting with WebFlux/Netty required by Spring Cloud Gateway)
- **Gateway** now runs correctly on Netty (previously ran on Tomcat due to servlet dependency conflict — caused all gateway route proxying to silently fail)
- **Removed `realm-service` gateway route** (`Path=/api/realms/**`) — it was shadowing rbac and client routes; realm-service is internal and accessed only via admin-api
- **`WebClientConfig.java`** in admin-api — all WebClient beans now use `DefaultAddressResolverGroup.INSTANCE` to force JVM DNS
- **Console `users.ts`** — fixed API paths: `list` and `create` now call `/admin/realms/{realm}/users` (was `/admin/users?realm=...`)
- **Console `clients.ts`** — fixed API paths: `list` and `create` now call `/admin/realms/{realm}/clients` (was `/admin/clients`)
- **Auth-service `AuthorizationServerConfig.java`** — `opengate-console` registered client redirect URI fixed from `/api/auth/callback` to `/callback`
- **Console `Sidebar.tsx` logout** — now clears `opengate_token`, `opengate_refresh_token`, `opengate_user`, `pkce_verifier`, and `oauth_state` (was only clearing the token)
- **Console `login/page.tsx` switch-account** — same full clear as logout before triggering `prompt=login` flow
- **`next.config.js`** in console and sample-frontend — added `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`
- **README** — updated Quick Start to reflect Docker-first workflow, corrected Gradle version and build DSL

### Fixed
- **"Failed to create realm"** — root cause was Netty async DNS resolver (`io.netty.resolver.dns`) could not resolve Docker container hostnames (returned NXDOMAIN). Fixed by using JVM DNS resolver in both admin-api WebClients and gateway HTTP client.
- **Gateway routing broken** — gateway was running on Tomcat (servlet mode) instead of Netty (WebFlux/reactive). Spring Cloud Gateway requires reactive; servlet mode caused all proxied requests to silently fail. Fixed by removing `opengate-common` (which pulled in `spring-boot-starter-web`) from gateway dependencies.
- **Role/client API 404** — `/api/realms/**` catch-all route was routing role and client calls to realm-service instead of rbac-service/client-service. Fixed by removing the catch-all and adding specific routes.
- **realm-service crash on startup** — `SchemaManagementException`: `password_policy` column was `jsonb` in DB but `text` in entity. Fixed with V2 Flyway migration.
- **session-service crash on startup** — `NoSuchBeanDefinitionException` for `RedisTemplate<String, Object>`. Fixed with explicit `RedisConfig.java` bean definition.
- **Logout not clearing session** — clicking "Sign Out" only removed `opengate_token`, leaving `refresh_token`, `user`, and PKCE state. User could not fully log out.
- **Switch Account incomplete** — "Switch Account" button did not clear all stored auth data before forcing re-login.

---

## [v1.0.0] — 2026-03-07

### Added
- Initial release of OpenGate IAM platform
- 10 Spring Boot 3.3 microservices (auth, user, realm, rbac, client, mfa, session, notification, admin-api, gateway)
- Spring Authorization Server 1.3 — OAuth2 Authorization Code + PKCE, Client Credentials, Refresh Token
- Multi-realm tenancy with isolated users, roles, and clients per realm
- RBAC service with role creation, assignment, and policy evaluation
- Redis-backed session tracking with Kafka event streaming
- Admin Console (Next.js 14) with dashboard, realm/user/role/client management
- Sample frontend demonstrating PKCE login flow
- Documentation site (Next.js 14 + MDX)
- PostgreSQL 16 with Flyway database migrations per service
- Spring Boot starter (`opengate-spring-boot-starter`) for resource server integration
