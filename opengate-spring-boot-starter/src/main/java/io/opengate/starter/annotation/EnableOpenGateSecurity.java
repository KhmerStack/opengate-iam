package io.opengate.starter.annotation;

import io.opengate.starter.autoconfigure.OpenGateAutoConfiguration;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

/**
 * Enable OpenGate IAM security on a Spring Boot application.
 *
 * Usage (optional — auto-configuration handles it automatically):
 *
 *   @SpringBootApplication
 *   @EnableOpenGateSecurity
 *   public class MyApp { ... }
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(OpenGateAutoConfiguration.class)
public @interface EnableOpenGateSecurity {
}
