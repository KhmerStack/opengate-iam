# Contributing to OpenGate IAM

Thank you for your interest in contributing to OpenGate IAM! This document explains how to get involved.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Getting Started

### Prerequisites

- Java 21+
- Gradle 8.7+
- Docker & Docker Compose (for infrastructure)
- Node.js 18+ (for frontends)

### Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/opengate.git
cd opengate

# 2. Start infrastructure
cd docker && docker compose up -d && cd ..

# 3. Build all services
./gradlew build -x test

# 4. Run a specific service
./gradlew :opengate-auth-service:bootRun
```

## Project Structure

```
opengate/
├── opengate-gateway/           Spring Cloud Gateway
├── opengate-auth-service/      OAuth2/OIDC Authorization Server
├── opengate-user-service/      User management
├── opengate-realm-service/     Multi-tenant realm config
├── opengate-rbac-service/      Roles & permissions
├── opengate-client-service/    OAuth2 client registry
├── opengate-mfa-service/       Multi-factor authentication
├── opengate-session-service/   Session management
├── opengate-notification-service/ Email notifications
├── opengate-admin-api/         Admin REST API aggregator
├── opengate-common/            Shared DTOs and exceptions
├── opengate-spring-boot-starter/ Auto-configuration library
├── opengate-sample-app/        Demo protected REST API
├── opengate-console/           Admin Console (Next.js 14)
├── opengate-docs/              Documentation site (Next.js + MDX)
├── opengate-sample-frontend/   Sample SPA (Next.js 14, PKCE)
└── docker/                     Docker Compose infrastructure
```

## Development Workflow

### Branching strategy

- `main` — stable releases
- `develop` — integration branch
- `feature/your-feature` — feature branches
- `fix/your-fix` — bug fix branches

```bash
# Create a feature branch
git checkout -b feature/add-webauthn-support

# Make your changes, then commit
git add -p
git commit -m "feat: add WebAuthn/FIDO2 authentication support"

# Push and open a PR
git push origin feature/add-webauthn-support
```

### Commit message format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
Scope: auth, user, realm, rbac, client, mfa, session, gateway, console, docs
```

Examples:
```
feat(auth): add WebAuthn registration endpoint
fix(realm): resolve jsonb null insert error on PostgreSQL
docs(integration): add Node.js integration guide
chore(deps): upgrade Spring Boot to 3.3.1
```

## Submitting Changes

1. **Open an issue first** for significant changes — discuss the approach before coding
2. **Fork** the repository and create a branch from `develop`
3. **Write tests** for new features and bug fixes
4. **Update documentation** if you change behavior or add features
5. **Open a Pull Request** with a clear title and description
6. **Respond to reviews** promptly and make requested changes

### Pull Request checklist

- [ ] Tests pass (`./gradlew test`)
- [ ] No new compiler warnings
- [ ] Documentation updated (if applicable)
- [ ] Commit messages follow conventional format
- [ ] PR description explains what and why

## Coding Standards

### Java / Spring Boot

- Follow standard Java naming conventions
- Use `@RequiredArgsConstructor` + `final` fields (no `@Autowired`)
- All controllers must have `@RequestMapping` with explicit paths
- Use `record` types for DTOs where possible
- Add `@Valid` on all request body parameters
- Handle exceptions with `@ControllerAdvice` — no raw `try/catch` in controllers

### TypeScript / React

- Functional components only — no class components
- Use `const` + arrow functions
- Type everything — avoid `any` where possible
- Use `@tanstack/react-query` for server state
- Follow existing component patterns in `opengate-console/src/components`

### MDX Documentation

- Each page needs `export const metadata = { title: '...' }`
- Use `<Callout>` for important notes
- Code blocks must specify language
- Keep prose concise — prefer examples over explanations

## Testing

### Backend

```bash
# Run all tests
./gradlew test

# Run tests for a specific service
./gradlew :opengate-auth-service:test

# Run with coverage
./gradlew test jacocoTestReport
```

### Frontend

```bash
cd opengate-console
npm test

cd opengate-sample-frontend
npm test
```

### Manual end-to-end testing

```bash
# 1. Start all services
./gradlew :opengate-auth-service:bootRun &
./gradlew :opengate-sample-app:bootRun &

# 2. Get a token
TOKEN=$(curl -s -X POST http://localhost:9081/oauth2/token \
  -H "Authorization: Basic $(echo -n 'sample-app:sample-secret' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&scope=openid" \
  | jq -r '.access_token')

# 3. Test endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/products
curl -H "Authorization: Bearer $TOKEN" http://localhost:8090/api/me
```

## Getting Help

- Open a [GitHub Discussion](https://github.com/opengate-iam/opengate/discussions)
- Check the [Documentation](http://localhost:3001)
- Email: [muyleang@khmerstack.com](mailto:muyleang@khmerstack.com)

---

Made with ❤️ by **[Ing Muyleang](https://muyleanging.com)** · **[KhmerStack](https://khmerstack.muyleanging.com)**
