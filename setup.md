# 🛡️ OpenGate IAM

> **GitHub Repository Name: `opengate-iam`**
> `github.com/your-org/opengate-iam`

**OpenGate IAM** is a fully open-source, self-hosted Identity & Access Management platform built with **Spring Boot 3 microservices** + **Gradle** — inspired by Keycloak and Okta but designed as true cloud-native microservices with a beautiful **Next.js + TypeScript** Admin Console and Documentation site.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Gradle](https://img.shields.io/badge/Gradle-8.x-blue.svg)](https://gradle.org/)

---

## 📁 Repository Structure

```
opengate-iam/
├── settings.gradle.kts             ← Gradle multi-module registry
├── build.gradle.kts                ← Root shared config
├── gradle/
│   └── libs.versions.toml          ← Version catalog (TOML)
│
├── opengate-common/                ← Shared DTOs, exceptions, utilities
├── opengate-auth-service/          ← OAuth2 / OIDC / SAML Authorization Server  :8081
├── opengate-user-service/          ← User CRUD, passwords, social links          :8082
├── opengate-realm-service/         ← Multi-tenant realm configuration            :8083
├── opengate-rbac-service/          ← Roles, groups, ABAC policy engine           :8084
├── opengate-client-service/        ← OAuth2 client registry & secrets            :8085
├── opengate-mfa-service/           ← TOTP, WebAuthn, SMS/email OTP               :8086
├── opengate-session-service/       ← SSO sessions, SLO, device tracking          :8087
├── opengate-notification-service/  ← Email/SMS templates & dispatch              :8088
├── opengate-admin-api/             ← Admin REST API (aggregates all services)    :8089
├── opengate-gateway/               ← Spring Cloud Gateway (entry point)          :8080
│
├── opengate-console/               ← 🌐 Next.js 16 + TypeScript Admin Console
│   ├── app/                        ← App Router pages
│   ├── components/                 ← Reusable UI components
│   ├── lib/                        ← API clients, auth helpers
│   └── public/
│
├── opengate-docs/                  ← 📚 Next.js 14 Documentation Website
│   ├── app/                        ← App Router docs pages
│   ├── content/                    ← MDX documentation files
│   └── components/                 ← Doc UI components (sidebar, search, code blocks)
│
├── docker/
│   ├── docker-compose.infra.yml    ← PostgreSQL, Redis, Kafka, Vault
│   └── docker-compose.services.yml ← All IAM microservices
│
├── k8s/
│   └── helm/opengate-iam/          ← Kubernetes Helm chart
│
└── docs/                           ← Architecture docs, ADRs, OpenAPI specs
    ├── architecture.md
    └── adr/
```

---

## 🤖 Instructions for Claude Code Agent

> **READ THIS ENTIRE SECTION BEFORE WRITING ANY CODE.**
> This README is the single source of truth. Build everything described here.

---

### 🎯 Mission

Build **OpenGate IAM** — a production-ready, open-source IAM platform. The project has three major parts:

1. **Backend** — 10 Spring Boot 3 microservices built with Gradle (Kotlin DSL)
2. **Admin Console** — Next.js 14 + TypeScript web app for managing the platform
3. **Documentation Site** — Next.js 14 + TypeScript beautiful docs site with MDX

---

### 🔧 Part 1: Gradle Multi-Module Backend

#### Root `settings.gradle.kts`
```kotlin
rootProject.name = "opengate-iam"

include(
    "opengate-common",
    "opengate-auth-service",
    "opengate-user-service",
    "opengate-realm-service",
    "opengate-rbac-service",
    "opengate-client-service",
    "opengate-mfa-service",
    "opengate-session-service",
    "opengate-notification-service",
    "opengate-admin-api",
    "opengate-gateway"
)
```

#### Root `build.gradle.kts`
```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.3.0" apply false
    id("io.spring.dependency-management") version "1.1.4" apply false
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    group = "io.opengate.iam"
    version = "1.0.0"
    java.sourceCompatibility = JavaVersion.VERSION_21

    repositories { mavenCentral() }

    dependencies {
        "testImplementation"("org.springframework.boot:spring-boot-starter-test")
        "testImplementation"("org.junit.jupiter:junit-jupiter")
    }

    tasks.withType<Test> { useJUnitPlatform() }
}
```

#### `gradle/libs.versions.toml`
```toml
[versions]
spring-boot       = "3.3.0"
spring-cloud      = "2023.0.1"
spring-authserver = "1.3.0"
postgresql        = "42.7.3"
flyway            = "10.12.0"
mapstruct         = "1.5.5.Final"
testcontainers    = "1.19.8"
jjwt              = "0.12.5"

[libraries]
spring-boot-web         = { module = "org.springframework.boot:spring-boot-starter-web" }
spring-boot-security    = { module = "org.springframework.boot:spring-boot-starter-security" }
spring-boot-data-jpa    = { module = "org.springframework.boot:spring-boot-starter-data-jpa" }
spring-boot-redis       = { module = "org.springframework.boot:spring-boot-starter-data-redis" }
spring-boot-actuator    = { module = "org.springframework.boot:spring-boot-starter-actuator" }
spring-boot-validation  = { module = "org.springframework.boot:spring-boot-starter-validation" }
spring-boot-mail        = { module = "org.springframework.boot:spring-boot-starter-mail" }
spring-auth-server      = { module = "org.springframework.security:spring-security-oauth2-authorization-server", version.ref = "spring-authserver" }
spring-cloud-gateway    = { module = "org.springframework.cloud:spring-cloud-starter-gateway" }
spring-cloud-eureka     = { module = "org.springframework.cloud:spring-cloud-starter-netflix-eureka-client" }
spring-kafka            = { module = "org.springframework.kafka:spring-kafka" }
postgresql              = { module = "org.postgresql:postgresql", version.ref = "postgresql" }
flyway-core             = { module = "org.flywaydb:flyway-core", version.ref = "flyway" }
flyway-postgres         = { module = "org.flywaydb:flyway-database-postgresql", version.ref = "flyway" }
mapstruct               = { module = "org.mapstruct:mapstruct", version.ref = "mapstruct" }
mapstruct-processor     = { module = "org.mapstruct:mapstruct-processor", version.ref = "mapstruct" }
springdoc-openapi       = { module = "org.springdoc:springdoc-openapi-starter-webmvc-ui", version = "2.5.0" }
jjwt-api                = { module = "io.jsonwebtoken:jjwt-api", version.ref = "jjwt" }
jjwt-impl               = { module = "io.jsonwebtoken:jjwt-impl", version.ref = "jjwt" }
testcontainers-postgres = { module = "org.testcontainers:postgresql", version.ref = "testcontainers" }
testcontainers-junit    = { module = "org.testcontainers:junit-jupiter", version.ref = "testcontainers" }

[plugins]
spring-boot = { id = "org.springframework.boot", version.ref = "spring-boot" }
```

---

### 🧩 Each Microservice Structure

Every service (`opengate-*-service/`) must follow this exact package layout:

```
src/main/java/io/opengate/iam/{servicename}/
├── controller/          ← @RestController classes
├── service/             ← @Service business logic
├── repository/          ← Spring Data JPA @Repository
├── domain/
│   └── entity/          ← @Entity JPA entities
├── dto/
│   ├── request/         ← Request DTOs (Java records)
│   └── response/        ← Response DTOs (Java records)
├── mapper/              ← MapStruct @Mapper interfaces
├── config/              ← Spring config classes (Security, Kafka, Redis, etc.)
├── event/               ← Kafka @KafkaListener and event publishers
├── exception/           ← Custom exceptions + @RestControllerAdvice
└── {ServiceName}Application.java

src/main/resources/
├── application.yml
└── db/migration/        ← Flyway SQL files (V1__init.sql, V2__add_columns.sql, etc.)

src/test/java/...        ← Unit + integration tests with Testcontainers
```

---

### 🔐 Service Details

#### `opengate-auth-service` — OAuth2 / OIDC Authorization Server
- Use **Spring Authorization Server 1.3** (`spring-security-oauth2-authorization-server`)
- Implement these endpoints:
  - `GET  /realms/{realm}/protocol/openid-connect/auth` — Authorization endpoint
  - `POST /realms/{realm}/protocol/openid-connect/token` — Token endpoint
  - `POST /realms/{realm}/protocol/openid-connect/logout` — Logout
  - `POST /realms/{realm}/protocol/openid-connect/revoke` — RFC 7009 revocation
  - `POST /realms/{realm}/protocol/openid-connect/introspect` — RFC 7662 introspection
  - `GET  /realms/{realm}/protocol/openid-connect/userinfo` — OIDC UserInfo
  - `GET  /realms/{realm}/.well-known/openid-configuration` — OIDC Discovery
  - `GET  /realms/{realm}/protocol/openid-connect/certs` — JWKS endpoint
- Support grant types: `authorization_code`, `client_credentials`, `refresh_token`, `device_code`
- Enforce PKCE (S256) for public clients
- Sign JWTs with RSA-256 keys (load from environment / Vault)
- Store authorization codes in Redis (TTL 60 seconds)
- Publish Kafka events: `auth.token.issued`, `auth.login.success`, `auth.login.failure`
- JWT Access Token claims: `sub`, `iss`, `aud`, `exp`, `iat`, `realm_access.roles`, `resource_access`, `scope`, `sid`

#### `opengate-user-service` — User Management
- CRUD: `POST /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`
- `GET /users?realm={realm}&search={q}&page=0&size=20` — paginated search
- `POST /users/{id}/reset-password` — trigger password reset email
- `POST /users/{id}/send-verify-email` — email verification
- `GET  /users/{id}/sessions` — list active sessions
- `DELETE /users/{id}/sessions` — revoke all sessions
- Password hashing: **BCrypt** cost factor 12 via `BCryptPasswordEncoder`
- Social links table: Google, GitHub, Facebook
- Publish Kafka events: `user.created`, `user.updated`, `user.deleted`, `user.login`
- Flyway migration `V1__create_users.sql`: tables `users`, `user_credentials`, `user_social_links`

#### `opengate-realm-service` — Multi-Tenant Realms
- CRUD: `POST /realms`, `GET /realms/{realm}`, `PUT /realms/{realm}`, `DELETE /realms/{realm}`
- Each realm has: `id`, `name`, `displayName`, `loginTheme`, `tokenLifespanSeconds` (default 300), `refreshTokenLifespanSeconds` (default 2592000), `mfaRequired`, `passwordPolicy` (JSONB), `smtpSettings` (JSONB), `createdAt`, `updatedAt`
- Flyway migration `V1__create_realms.sql`

#### `opengate-rbac-service` — Roles, Groups & Permissions
- Endpoints: manage roles, groups, user-role mappings, policies
- `GET  /realms/{realm}/roles` — list roles
- `POST /realms/{realm}/roles` — create role
- `GET  /realms/{realm}/groups` — list groups (tree structure)
- `POST /realms/{realm}/users/{userId}/role-mappings` — assign role to user
- `POST /evaluate` — evaluate policy for a user+resource+action (returns PERMIT/DENY)
- Tables: `roles`, `groups`, `user_role_mappings`, `group_role_mappings`, `policies`
- Support composite roles (role includes other roles)

#### `opengate-client-service` — OAuth2 Client Registry
- CRUD for OAuth2 clients per realm
- `POST /realms/{realm}/clients` — register client (generates `clientId` + `clientSecret`)
- `POST /realms/{realm}/clients/{id}/secret/regenerate` — rotate secret
- Store: `redirectUris` (TEXT[]), `webOrigins` (TEXT[]), `grantTypes` (TEXT[]), `scopes` (TEXT[])
- `pkceRequired` BOOLEAN — enforce PKCE for this client
- `publicClient` BOOLEAN — no secret for SPAs
- Hash client secrets with BCrypt before storing

#### `opengate-mfa-service` — Multi-Factor Authentication
- `POST /mfa/totp/setup` — generate TOTP secret + QR code URI (Google Authenticator compatible)
- `POST /mfa/totp/verify` — verify TOTP code (6-digit, 30s window, allow ±1 step)
- `POST /mfa/otp/email/send` — send 6-digit OTP via email (TTL 10 min in Redis)
- `POST /mfa/otp/email/verify` — verify email OTP
- `POST /mfa/otp/sms/send` — send SMS OTP via Twilio
- `POST /mfa/webauthn/register/start` — start WebAuthn registration ceremony
- `POST /mfa/webauthn/register/finish` — complete WebAuthn registration
- `POST /mfa/webauthn/auth/start` — start WebAuthn authentication
- `POST /mfa/webauthn/auth/finish` — complete WebAuthn authentication
- `GET  /mfa/backup-codes/generate` — generate 10 backup codes (hashed, single-use)
- Use library: `com.yubico:java-webauthn-server:2.5.0`

#### `opengate-session-service` — Session Management (Redis-backed)
- Store sessions in Redis with TTL
- `POST /sessions` — create session (returns `sessionId`)
- `GET  /sessions/{sessionId}` — get session info
- `DELETE /sessions/{sessionId}` — terminate session (single logout)
- `GET  /users/{userId}/sessions` — list all active sessions for user
- `DELETE /users/{userId}/sessions` — terminate ALL sessions for user (admin logout)
- Each session stores: `userId`, `realmId`, `clientIds[]`, `ipAddress`, `userAgent`, `createdAt`, `lastAccessedAt`, `expiresAt`
- Publish Kafka event: `session.terminated` on logout (triggers SSO SLO)

#### `opengate-notification-service` — Email & SMS
- Kafka consumer: listens to `notification.email.send`, `notification.sms.send`
- REST: `POST /notifications/email` — direct send (for admin use)
- Thymeleaf email templates (store in `src/main/resources/templates/email/`):
  - `welcome.html` — new user welcome
  - `verify-email.html` — email verification link
  - `reset-password.html` — password reset link
  - `mfa-otp.html` — MFA OTP code
  - `login-alert.html` — new login from unrecognized device
- SMTP config via `application.yml` (Spring Mail)
- SMS via Twilio REST API (configurable)
- Store notification history in `notifications` table

#### `opengate-admin-api` — Admin REST API Aggregator
This service is the **Keycloak-equivalent Admin REST API**. It calls all other services internally and exposes a unified API:

```
/admin/realms                          ← Realm CRUD
/admin/realms/{realm}/users            ← User management
/admin/realms/{realm}/users/{id}/roles ← Role assignments
/admin/realms/{realm}/roles            ← Role management
/admin/realms/{realm}/groups           ← Group management
/admin/realms/{realm}/clients          ← Client management
/admin/realms/{realm}/events           ← Audit event query
/admin/realms/{realm}/sessions         ← Session management
/admin/realms/{realm}/stats            ← Dashboard stats (user count, active sessions, etc.)
```

- Protected by JWT — only tokens with `ROLE_ADMIN` or `realm-management` scope can access
- Use `WebClient` (Spring WebFlux) to call downstream services
- Full OpenAPI 3 spec via Springdoc

#### `opengate-gateway` — API Gateway
- Use **Spring Cloud Gateway**
- Routes:
  - `/realms/**` → `opengate-auth-service`
  - `/api/users/**` → `opengate-user-service`
  - `/api/realms/**` → `opengate-realm-service`
  - `/api/roles/**` → `opengate-rbac-service`
  - `/api/clients/**` → `opengate-client-service`
  - `/api/mfa/**` → `opengate-mfa-service`
  - `/api/sessions/**` → `opengate-session-service`
  - `/admin/**` → `opengate-admin-api`
- Global filters: rate limiting (Redis token bucket), request logging, CORS
- `application.yml` CORS: allow all origins in dev, configurable in prod

---

### 🌐 Part 2: Admin Console — `opengate-console/`

**Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, React Query, Zod

#### Setup
```bash
cd opengate-console
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
npx shadcn-ui@latest init
npm install @tanstack/react-query axios zod react-hook-form @hookform/resolvers
npm install lucide-react recharts date-fns
```

#### App Router Structure
```
opengate-console/
└── src/
    ├── app/
    │   ├── layout.tsx                      ← Root layout (sidebar + topbar)
    │   ├── page.tsx                        ← Redirect to /dashboard
    │   ├── (auth)/
    │   │   └── login/page.tsx              ← Admin login page
    │   └── (dashboard)/
    │       ├── layout.tsx                  ← Dashboard layout with sidebar
    │       ├── dashboard/page.tsx          ← Overview stats
    │       ├── realms/
    │       │   ├── page.tsx                ← List realms
    │       │   ├── new/page.tsx            ← Create realm
    │       │   └── [realmId]/
    │       │       ├── page.tsx            ← Realm overview
    │       │       ├── settings/page.tsx   ← Realm settings
    │       │       ├── users/
    │       │       │   ├── page.tsx        ← User list (paginated, searchable)
    │       │       │   ├── new/page.tsx    ← Create user
    │       │       │   └── [userId]/page.tsx ← User detail + roles + sessions
    │       │       ├── roles/
    │       │       │   ├── page.tsx        ← Role list
    │       │       │   └── new/page.tsx    ← Create role
    │       │       ├── clients/
    │       │       │   ├── page.tsx        ← Client list
    │       │       │   ├── new/page.tsx    ← Register client
    │       │       │   └── [clientId]/page.tsx ← Client detail + secret
    │       │       ├── groups/page.tsx     ← Group tree
    │       │       ├── sessions/page.tsx   ← Active sessions table
    │       │       └── events/page.tsx     ← Audit log
    │       └── system/
    │           ├── health/page.tsx         ← Service health status
    │           └── settings/page.tsx       ← Global settings
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx                 ← Left navigation sidebar
    │   │   ├── Topbar.tsx                  ← Top header bar
    │   │   └── Breadcrumb.tsx
    │   ├── ui/                             ← shadcn/ui components
    │   ├── users/
    │   │   ├── UserTable.tsx               ← Data table with pagination + search
    │   │   ├── UserForm.tsx                ← Create/edit user form
    │   │   └── UserRoles.tsx               ← Role assignment UI
    │   ├── clients/
    │   │   ├── ClientTable.tsx
    │   │   ├── ClientForm.tsx
    │   │   └── SecretDisplay.tsx           ← Show/copy/regenerate client secret
    │   ├── dashboard/
    │   │   ├── StatsCards.tsx              ← Active users, sessions, realms cards
    │   │   ├── LoginChart.tsx              ← Recharts line chart of logins over time
    │   │   └── RecentEvents.tsx            ← Recent audit events feed
    │   └── shared/
    │       ├── DataTable.tsx               ← Generic reusable table component
    │       ├── ConfirmDialog.tsx           ← Delete confirmation modal
    │       ├── PageHeader.tsx              ← Page title + action buttons
    │       └── EmptyState.tsx
    ├── lib/
    │   ├── api/
    │   │   ├── client.ts                   ← Axios instance with auth interceptor
    │   │   ├── realms.ts                   ← Realm API calls
    │   │   ├── users.ts                    ← User API calls
    │   │   ├── roles.ts                    ← Role API calls
    │   │   ├── clients.ts                  ← Client API calls
    │   │   └── events.ts                   ← Audit event API calls
    │   ├── types/
    │   │   └── index.ts                    ← TypeScript interfaces for all entities
    │   └── utils.ts
    └── hooks/
        ├── useRealms.ts
        ├── useUsers.ts
        └── useClients.ts
```

#### Design Requirements for Admin Console
- **Color scheme:** Dark navy sidebar (`#0D1B2A`), white content area, cyan accent (`#00B4D8`)
- **Sidebar:** Logo at top, realm selector dropdown, navigation links with icons (lucide-react), collapsed/expanded state
- **Dashboard page:** 4 stat cards (Total Users, Active Sessions, Registered Clients, Realms), line chart of logins per day (last 7 days), recent audit events table
- **Users page:** Server-side paginated table, search bar, filter by enabled/disabled, bulk actions (enable/disable/delete), row click → user detail
- **User detail page:** Tabs: Details | Credentials | Role Mappings | Sessions | Events
- **Clients page:** Table with client ID, type (public/confidential), enabled toggle, secret copy button
- **All forms:** use `react-hook-form` + `zod` validation, show inline errors
- **Loading states:** skeleton loaders for tables and cards
- **Toast notifications:** on success/error for all mutations (use shadcn/ui Toaster)

---

### 📚 Part 3: Documentation Site — `opengate-docs/`

**Stack:** Next.js 14, TypeScript, Tailwind CSS, MDX (`@next/mdx`), `next-mdx-remote`

#### Setup
```bash
cd opengate-docs
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
npm install @next/mdx @mdx-js/loader @mdx-js/react next-mdx-remote
npm install rehype-highlight rehype-slug remark-gfm
npm install lucide-react
```

#### App Router Structure
```
opengate-docs/
└── src/
    ├── app/
    │   ├── layout.tsx                      ← Root layout (top nav + sidebar)
    │   ├── page.tsx                        ← Landing/home page
    │   └── docs/
    │       ├── layout.tsx                  ← Docs layout (sidebar + content + TOC)
    │       ├── page.tsx                    ← Docs home / getting started
    │       ├── getting-started/
    │       │   ├── introduction/page.mdx   ← What is OpenGate IAM?
    │       │   ├── quickstart/page.mdx     ← Docker Compose quickstart
    │       │   ├── installation/page.mdx   ← Full installation guide
    │       │   └── configuration/page.mdx  ← Environment variables reference
    │       ├── concepts/
    │       │   ├── realms/page.mdx         ← What are realms?
    │       │   ├── users/page.mdx          ← User management concepts
    │       │   ├── oauth2-oidc/page.mdx    ← OAuth2 & OIDC explained
    │       │   ├── roles-rbac/page.mdx     ← RBAC concepts
    │       │   └── tokens/page.mdx         ← JWT token structure & claims
    │       ├── guides/
    │       │   ├── social-login/page.mdx   ← Setting up Google/GitHub login
    │       │   ├── mfa/page.mdx            ← Configuring MFA
    │       │   ├── saml/page.mdx           ← SAML 2.0 integration
    │       │   ├── spring-integration/page.mdx ← Using with Spring Boot apps
    │       │   └── nextjs-integration/page.mdx ← Using with Next.js (NextAuth.js)
    │       ├── api-reference/
    │       │   ├── auth/page.mdx           ← Auth endpoints (OIDC, token, etc.)
    │       │   ├── users/page.mdx          ← User API reference
    │       │   ├── realms/page.mdx         ← Realm API reference
    │       │   ├── roles/page.mdx          ← Role & RBAC API reference
    │       │   └── clients/page.mdx        ← Client registration API
    │       └── deployment/
    │           ├── docker/page.mdx         ← Docker Compose deployment
    │           └── kubernetes/page.mdx     ← Kubernetes + Helm deployment
    ├── components/
    │   ├── layout/
    │   │   ├── DocsSidebar.tsx             ← Left nav tree (collapsible sections)
    │   │   ├── DocsTopNav.tsx              ← Top bar with GitHub link + search
    │   │   ├── TableOfContents.tsx         ← Right-side TOC from headings
    │   │   └── DocsPagination.tsx          ← Previous / Next page nav
    │   ├── mdx/
    │   │   ├── CodeBlock.tsx               ← Syntax-highlighted code block with copy button
    │   │   ├── Callout.tsx                 ← Info/Warning/Danger callout boxes
    │   │   ├── Tabs.tsx                    ← Code tab switcher (e.g. curl vs JS vs Python)
    │   │   └── ApiEndpoint.tsx             ← Styled API endpoint display (METHOD + path)
    │   └── home/
    │       ├── Hero.tsx                    ← Hero section with CTA buttons
    │       ├── FeatureGrid.tsx             ← 6-feature grid with icons
    │       └── QuickStart.tsx              ← Docker Compose code snippet
    └── lib/
        ├── navigation.ts                   ← Sidebar navigation config (tree structure)
        └── mdx.ts                          ← MDX loading and rendering utilities
```

#### Design Requirements for Docs Site
- **Landing page (`/`):** Hero with "OpenGate IAM" title, tagline, "Get Started" + "View on GitHub" buttons, feature grid (OAuth2/OIDC, Multi-Tenant, Spring Boot, Open Source, RBAC, Admin Console), code snippet showing docker compose quickstart
- **Docs layout:** Fixed left sidebar with collapsible sections, scrollable main content with MDX, fixed right Table of Contents, breadcrumbs at top
- **Code blocks:** Syntax highlighted (use `rehype-highlight` with github theme), copy button, language label
- **Callout component:** 4 variants — `info` (blue), `warning` (yellow), `danger` (red), `tip` (green) — with icon and colored left border
- **Color scheme:** White background, navy text, cyan accent links, dark code blocks
- **Mobile responsive:** Hamburger menu for sidebar on mobile, TOC hidden on small screens
- **Search:** Add basic client-side search over doc titles (can use simple in-memory index)
- **Typography:** Large comfortable line height, good contrast, `prose` Tailwind class for MDX body

#### Example MDX Page (`quickstart/page.mdx`)
```mdx
# Quick Start

Get OpenGate IAM running in under 5 minutes with Docker Compose.

## Prerequisites

- Docker Desktop 4.x+
- Docker Compose v2+

## 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-org/opengate-iam
cd opengate-iam
\`\`\`

## 2. Start Infrastructure

\`\`\`bash
docker compose -f docker/docker-compose.infra.yml up -d
\`\`\`

This starts PostgreSQL, Redis, Kafka, and HashiCorp Vault.

<Callout type="info">
  Wait ~10 seconds for all infrastructure services to be healthy before starting the IAM services.
</Callout>

## 3. Start IAM Services

\`\`\`bash
docker compose -f docker/docker-compose.services.yml up -d
\`\`\`

## 4. Access the Platform

| Service | URL |
|---------|-----|
| Admin Console | http://localhost:3000 |
| OIDC Discovery | http://localhost:8080/realms/master/.well-known/openid-configuration |
| API Gateway | http://localhost:8080 |
| Docs Site | http://localhost:3001 |

Default admin credentials: `admin` / `admin` (change immediately in production)
```

---

### 🗄️ Docker Compose Files

#### `docker/docker-compose.infra.yml`
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: opengate_dev
      POSTGRES_USER: opengate
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    environment:
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_NODE_ID: 1
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
      CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
    ports: ["9092:9092"]

  vault:
    image: hashicorp/vault:1.16
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: opengate-dev-token
      VAULT_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
    ports: ["8200:8200"]
    cap_add: [IPC_LOCK]
    command: server -dev

volumes:
  postgres_data:
```

---

### ✅ Build Order

Build in this order to avoid dependency issues:

1. `opengate-common` — build first (shared lib)
2. `opengate-realm-service` — no upstream service deps
3. `opengate-user-service`
4. `opengate-rbac-service`
5. `opengate-client-service`
6. `opengate-auth-service` — depends on user + realm + rbac + client
7. `opengate-mfa-service`
8. `opengate-session-service`
9. `opengate-notification-service`
10. `opengate-admin-api` — aggregates all services
11. `opengate-gateway` — routes to all services
12. `opengate-console/` — Next.js Admin Console
13. `opengate-docs/` — Next.js Documentation Site

---

### 🧪 Testing Requirements

- Every service: unit tests for all `@Service` classes
- Every service: at least one integration test using `@SpringBootTest` + Testcontainers PostgreSQL
- Auth service: integration test for full PKCE authorization code flow
- Use `MockMvc` for controller tests

---

### ⚙️ Environment Variables

Each service reads config from `application.yml`. Use these env var names consistently:

```yaml
# Database (per service, replace SERVICE_NAME)
SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/opengate_{service}
SPRING_DATASOURCE_USERNAME: opengate
SPRING_DATASOURCE_PASSWORD: opengate_dev

# Redis
SPRING_REDIS_HOST: localhost
SPRING_REDIS_PORT: 6379

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS: localhost:9092

# JWT Signing (auth service)
OPENGATE_JWT_RSA_PRIVATE_KEY: (RSA private key PEM or Vault path)
OPENGATE_JWT_RSA_PUBLIC_KEY:  (RSA public key PEM or Vault path)

# Admin Console
NEXT_PUBLIC_API_URL: http://localhost:8080
NEXT_PUBLIC_AUTH_URL: http://localhost:8080/realms/master

# Docs Site
NEXT_PUBLIC_SITE_URL: http://localhost:3001
```

---

### 📋 Kafka Topics

Create these topics automatically (set `KAFKA_AUTO_CREATE_TOPICS_ENABLE: true` in dev):

| Topic | Producer | Consumer |
|-------|----------|----------|
| `auth.login.success` | auth-service | notification-service, session-service |
| `auth.login.failure` | auth-service | notification-service |
| `auth.token.issued` | auth-service | — (audit) |
| `user.created` | user-service | notification-service |
| `user.updated` | user-service | — |
| `user.deleted` | user-service | session-service (revoke sessions) |
| `session.terminated` | session-service | auth-service (SLO) |
| `notification.email.send` | any service | notification-service |
| `notification.sms.send` | any service | notification-service |

---

## 🚀 Quick Start (For Humans)

```bash
# 1. Clone
git clone https://github.com/your-org/opengate-iam
cd opengate-iam

# 2. Infrastructure
docker compose -f docker/docker-compose.infra.yml up -d

# 3. Build all backend services
./gradlew clean build

# 4. Start services
docker compose -f docker/docker-compose.services.yml up -d

# 5. Admin Console
cd opengate-console && npm install && npm run dev
# → http://localhost:3000

# 6. Docs Site
cd opengate-docs && npm install && npm run dev
# → http://localhost:3001

# 7. OIDC Discovery
curl http://localhost:8080/realms/master/.well-known/openid-configuration

# 8. Run all tests
./gradlew test
```

---

## 📜 License

Apache License 2.0 — see [LICENSE](LICENSE)

This means: free to use, modify, and distribute — including for commercial use.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We welcome PRs, issues, and discussions!

---

*OpenGate IAM — Open Identity for Everyone*
