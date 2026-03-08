<div align="center">

<img src="https://via.placeholder.com/80x80/00B4D8/ffffff?text=OG" width="80" alt="OpenGate IAM" style="border-radius: 20px" />

# OpenGate IAM

**Open-source self-hosted Identity & Access Management**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1.1.0-00B4D8.svg)]()
[![Java](https://img.shields.io/badge/Java-21-orange.svg)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.0-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)]()

[Documentation](http://localhost:3000) · [Admin Console](http://localhost:3002) · [Sample App](http://localhost:3003) · [Quick Start](#quick-start) · [Changelog](CHANGELOG.md)

</div>

---

OpenGate IAM is a fully open-source, self-hosted Identity & Access Management platform built with **Spring Boot 3 microservices** and a **Next.js 14** Admin Console — inspired by Keycloak and Okta but designed as true cloud-native microservices.

## Features

- **OAuth 2.1 / OIDC** — Authorization Code + PKCE, Client Credentials, Refresh Token, Device Flow
- **Multi-Realm Tenancy** — fully isolated tenants with their own users, roles, and clients
- **MFA** — TOTP (Google Authenticator), Email OTP, SMS OTP, backup codes
- **RBAC** — roles, composite roles, groups, user-role mappings
- **Session Management** — Redis-backed, multi-device tracking, revocation
- **Event Streaming** — Kafka-driven audit events for all auth events
- **Admin Console** — Next.js 14 Admin UI with real-time stats
- **Spring Boot Starter** — `opengate-spring-boot-starter` for Keycloak-like integration
- **Documentation Site** — Full MDX docs on port 3001

## Architecture

```
                    ┌─────────────────┐
                    │  opengate-docs  │  :3001  (Next.js Docs)
                    │ opengate-console│  :3002  (Admin Console)
                    │opengate-sample- │  :3003  (Sample Frontend)
                    │   frontend      │
                    └────────┬────────┘
                             │ OAuth2 PKCE / REST
                    ┌────────▼────────┐
                    │opengate-gateway │  :9080  (Spring Cloud Gateway)
                    └────────┬────────┘
          ┌──────────────────┼──────────────────────┐
          │                  │                       │
 ┌────────▼───────┐ ┌────────▼───────┐  ┌──────────▼──────┐
 │  auth-service  │ │  user-service  │  │  realm-service  │
 │     :9081      │ │     :9082      │  │     :9083       │
 │ (OAuth2/OIDC)  │ │ (User CRUD)    │  │ (Multi-tenant)  │
 └────────────────┘ └────────────────┘  └─────────────────┘
          │                  │                       │
          └──────────────────┴───────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌───────▼───┐  ┌──────▼──────┐
     │ PostgreSQL │  │   Redis   │  │    Kafka    │
     │   :5433    │  │   :6380   │  │    :9092    │
     └────────────┘  └───────────┘  └─────────────┘
```

## Services

| Service | Port | Description |
|---|---|---|
| `opengate-gateway` | 9080 | Spring Cloud Gateway — routing, CORS, rate limiting |
| `opengate-auth-service` | 9081 | OAuth2/OIDC authorization server (Spring Auth Server 1.3) |
| `opengate-user-service` | 9082 | User lifecycle — CRUD, passwords, email verification |
| `opengate-realm-service` | 9083 | Multi-tenant realm configuration |
| `opengate-rbac-service` | 9084 | Roles, composite roles, groups, policy evaluation |
| `opengate-client-service` | 9085 | OAuth2 client registry |
| `opengate-mfa-service` | 9086 | TOTP, email/SMS OTP, backup codes |
| `opengate-session-service` | 9087 | Redis-backed sessions, device tracking, revocation |
| `opengate-notification-service` | 9088 | Email notifications via Kafka + SMTP |
| `opengate-admin-api` | 9089 | Aggregated admin REST API (WebFlux) |
| `opengate-sample-app` | 8090 | Demo REST API protected by OpenGate |
| `opengate-console` | 3002 | Admin Console (Next.js 14) |
| `opengate-docs` | 3001 | Documentation site (Next.js 14 + MDX) |
| `opengate-sample-frontend` | 3003 | Sample SPA with OAuth2 PKCE |

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.0 |
| Build | Gradle 8.12 (Groovy DSL) |
| Auth | Spring Authorization Server 1.3 |
| Database | PostgreSQL 16 + Flyway |
| Cache | Redis 7 |
| Messaging | Apache Kafka (KRaft mode) |
| Admin UI | Next.js 14 + TypeScript + Tailwind CSS |
| Docs | Next.js 14 + MDX |
| Container | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Docker & Docker Compose (everything runs in containers)

### Run with one command

```bash
git clone <repo>
cd opengate-iam

docker compose up --build
```

All 17 containers start in ~60-90 seconds. Open **http://localhost:3002** for the Admin Console.

Default accounts:

| Username | Password | Role |
|---|---|---|
| `admin` | `admin` | ADMIN, USER |
| `user` | `user` | USER |

### Environment configuration

Edit `.env` at the project root:

```env
DOMAIN=localhost          # change to your domain for production
PROTOCOL=http             # change to https for production
POSTGRES_USER=opengate
POSTGRES_PASSWORD=opengate_dev
```

### Run locally (without Docker)

Requires Java 21, Gradle 8.12, PostgreSQL, Redis.

```bash
# Start each service
./gradlew :opengate-auth-service:bootRun
./gradlew :opengate-user-service:bootRun
# ... etc

# Start frontends
cd opengate-console && npm install && npm run dev -- --port 3002
```

### Test the OAuth2 flow

```bash
# Get a token
TOKEN=$(curl -s -X POST http://localhost:9081/oauth2/token \
  -H "Authorization: Basic $(echo -n 'sample-app:sample-secret' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&scope=openid profile" \
  | jq -r '.access_token')

# Call a protected endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/products

# Call the admin endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/admin/dashboard
```

## Integration

### Spring Boot (like Keycloak)

```yaml
# application.yml
opengate:
  server-url: http://localhost:9080
  realm: master
  resource: my-app

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: http://localhost:9081/oauth2/jwks
```

```java
@GetMapping("/api/products")
@PreAuthorize("isAuthenticated()")
public List<Product> list() { ... }

@PostMapping("/api/products")
@PreAuthorize("hasRole('ADMIN')")
public Product create(@RequestBody Product p) { ... }
```

### React / Next.js (PKCE)

```typescript
// Generate PKCE pair and redirect to OpenGate
const verifier  = generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);

window.location.href = `http://localhost:9081/oauth2/authorize?` +
  `response_type=code&client_id=sample-app&` +
  `redirect_uri=http://localhost:3003/callback&` +
  `code_challenge=${challenge}&code_challenge_method=S256`;
```

## Documentation

Full documentation is available at **http://localhost:3001** when running locally.

- [Getting Started](http://localhost:3001/docs/getting-started)
- [Integration Guide](http://localhost:3001/docs/integration)
- [API Reference](http://localhost:3001/docs/api)
- [Deployment](http://localhost:3001/docs/deployment)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by **[Ing Muyleang](https://muyleanging.com)** · **[KhmerStack](https://khmerstack.muyleanging.com)**

</div>
