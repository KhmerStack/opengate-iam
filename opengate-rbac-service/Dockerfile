# ── Build stage (context = project root) ──────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

COPY opengate-common opengate-common
COPY opengate-spring-boot-starter opengate-spring-boot-starter
COPY opengate-rbac-service opengate-rbac-service

RUN printf 'org.gradle.native=false\norg.gradle.daemon=false\norg.gradle.jvmargs=-Dorg.gradle.native=false -Xmx1g\n' > gradle.properties && \
    chmod +x gradlew && \
    ./gradlew :opengate-rbac-service:bootJar -x test --no-daemon

# ── Runtime stage ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /workspace/opengate-rbac-service/build/libs /tmp/libs
RUN find /tmp/libs -name "*.jar" ! -name "*plain*" -exec mv {} app.jar \; && rm -rf /tmp/libs

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
